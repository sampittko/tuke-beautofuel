import pandas as pd
import numpy as np
from datetime import datetime
import geopy.distance
from dateutil import parser

from ..packages.envirocar import TrackAPI, TimeSelector, ECConfig
from ..packages.eda_quality import correction as correct
from ..packages.eda_quality import manipulation as manipulate
from ..packages.vehicle_eco_balance import get_interval_time, accumulate_consumption, consumption_per100km

from ..api.envirocar import get_envirocar_tracks, get_envirocar_user, get_envirocar_track
from ..api.strapi import get_strapi_tracks, update_strapi_tracks
from ..utils.functions import seconds_between
from ..utils.constants import ENVIROCAR_DATETIME_FORMAT, ENVIROCAR_DATA


async def handler(data, x_user, x_token, bbox, influxdb_client):
    time_interval, track_api = initialize_pipeline(data, x_user, x_token)

    tracks_df = track_api.get_tracks(bbox=bbox, time_interval=time_interval)

    if tracks_df.empty:
        print("There are no tracks to synchronize for user with name {}".format(x_user))
        return {'statusCode': 200, 'message': 'You need to record some driving data first to synchronize them later'}
    print("Tracks fetched")

    # TODO Move below and set flag for incompatible track so that it is not being refetched and cleaned every time
    tracks_df = clean_data(tracks_df)

    existing_tracks = await get_strapi_tracks(data)

    tracks_df, track_ids = filter_tracks(tracks_df, existing_tracks, data)

    if tracks_df.empty:
        message = 'There are no new track records for user with name {}'.format(
            x_user)
        print(message)
        return {'statusCode': 200, 'message': message}

    tracks_count = len(track_ids)
    print("There are {} new track records for user with name {}".format(
        tracks_count, x_user))

    try:
        await persist_new_tracks_data(tracks_df, track_ids, x_user, x_token, data, influxdb_client)
        print("Data persistence completed")
    except ChildProcessError:
        print("Data persistence is incomplete")

    if data.phaseNumber == 2 or data.phaseNumber == 3:
        print("Eco-score calculation not yet implemented")

    await update_strapi_tracks(tracks_df, track_ids, data.user, data.synchronization, data.phaseNumber, data.userGroup)

    return {'statusCode': 200, 'message': f'{tracks_count} tracks were processed'}


def initialize_pipeline(data, x_user, x_token):
    # TODO Revert for production
    # phase_start_time = parser.parse(
    #     data.phaseStartDate).strftime(ENVIROCAR_DATETIME_FORMAT)
    phase_start_time = parser.parse(
        "2020-01-12").strftime(ENVIROCAR_DATETIME_FORMAT)
    now_time = datetime.now().strftime(ENVIROCAR_DATETIME_FORMAT)
    time_interval = TimeSelector(
        start_time=phase_start_time, end_time=now_time)

    config = ECConfig(username=x_user, password=x_token, reset=True)

    track_api = TrackAPI()

    return time_interval, track_api


def clean_data(tracks_df):
    # Drop duplicated rows
    tracks_df = correct.drop_duplicates(tracks_df)
    # Drop rows where specific columns are NaN
    tracks_df = tracks_df.dropna(
        subset=[ENVIROCAR_DATA.TRACK_FEATURE_CONSUMPTION, ENVIROCAR_DATA.TRACK_FEATURE_EMISSION, ENVIROCAR_DATA.TRACK_FEATURE_SPEED])
    # Remove tracks that exceed 8 hours of duration time
    _, tracks_df, _ = correct.exceed_eight_hours(tracks_df, flag=False)
    # Remove tracks that falls below x minutes of duration time
    _, tracks_df, _ = correct.below_x_min(tracks_df, x=2, flag=False)
    # Remove tracks that exceed 250 km/h speed
    _, tracks_df, _ = correct.implausible_max_speed(tracks_df, flag=False)
    # Drop unit colums since we are not interested in them
    manipulate.drop_unit_columns(tracks_df).head()

    return tracks_df


def filter_tracks(tracks_df, existing_tracks, data):
    existing_track_ids = []

    track_ids = tracks_df[ENVIROCAR_DATA.TRACK_ID].unique()

    print("Number of tracks before filtering: {}".format(len(track_ids)))

    for existing_track in existing_tracks:
        existing_track_ids.append(existing_track['envirocar'])

    # No tracks are uploaded
    if len(existing_track_ids) == 0:
        print("No tracks were uploaded so far")
        return tracks_df, track_ids

    # Some tracks or all tracks are uploaded
    for existing_track_id in existing_track_ids:
        tracks_df = tracks_df[tracks_df[ENVIROCAR_DATA.TRACK_ID]
                              != existing_track_id]

    track_ids = tracks_df[ENVIROCAR_DATA.TRACK_ID].unique()
    print("Number of tracks after filtering: {}".format(len(track_ids)))

    return tracks_df, track_ids


async def persist_new_tracks_data(tracks_df, track_ids, x_user, x_token, data, influxdb_client):
    tracks = []
    for track_id in track_ids:
        track_df = tracks_df[tracks_df[ENVIROCAR_DATA.TRACK_ID] == track_id]

        track_point = build_track_point(track_df, data)
        tracks.append(track_point)

        track_features = []
        for _, track_df_row in track_df.iterrows():
            try:
                track_feature_point = build_track_feature_point(track_df_row)
                track_features.append(track_feature_point)
            except ValueError as e:
                print(e.message)

        persisted_track_features = influxdb_client.write_points(track_features)
        if not persisted_track_features:
            try:
                raise ChildProcessError()
            except ChildProcessError as e:
                e.message = "Track features persistence was not successful for track".format(
                    track_id)
                raise

    persisted_tracks = influxdb_client.write_points(tracks)
    if not persisted_tracks:
        try:
            raise ChildProcessError()
        except ChildProcessError as e:
            e.message = "Tracks persistence was not successful"
            raise


def build_track_point(track_df, data):
    first_coordinate_data = track_df.iloc[0]

    fuel_consumed, consumption, average_speed = calculate_track_data(track_df)

    return {
        'measurement': 'tracks',
        'tags': {
            'id': first_coordinate_data[ENVIROCAR_DATA.TRACK_ID],
            'user': first_coordinate_data[ENVIROCAR_DATA.USER],
            'email': first_coordinate_data[ENVIROCAR_DATA.EMAIL],
            'car': '{} {} {}'.format(
                first_coordinate_data[ENVIROCAR_DATA.CAR_MANUFACTURER], first_coordinate_data[ENVIROCAR_DATA.CAR_MODEL], first_coordinate_data[ENVIROCAR_DATA.CAR_CONSTRUCTION]),
            'carEngineDisplacement': first_coordinate_data[ENVIROCAR_DATA.CAR_ENGINE_DISPLACEMENT],
            'begin': first_coordinate_data[ENVIROCAR_DATA.TRACK_BEGIN],
            'end': first_coordinate_data[ENVIROCAR_DATA.TRACK_END],
            'consumption': consumption,
            'fuelConsumed': fuel_consumed,
            'scoreConsumption': 0,
            'speed': average_speed,
            'scoreSpeed': 0,
            'score': 0,
            'phase': data.phaseNumber
        },
        'time': first_coordinate_data[ENVIROCAR_DATA.TRACK_CREATED],
        'fields': {
            'length': first_coordinate_data[ENVIROCAR_DATA.TRACK_LENGTH],
            'scoreLength': 0,
            'duration': seconds_between(first_coordinate_data[ENVIROCAR_DATA.TRACK_BEGIN], first_coordinate_data[ENVIROCAR_DATA.TRACK_END]),
            'scoreDuration': 0
        }
    }


def calculate_track_data(track_df):
    # Calculate interval times
    dt = np.zeros(len(track_df[ENVIROCAR_DATA.TIME]))
    for i in range(1, len(track_df[ENVIROCAR_DATA.TIME])):
        dt[i] = get_interval_time(
            track_df[ENVIROCAR_DATA.TIME].iloc[i], track_df[ENVIROCAR_DATA.TIME].iloc[i-1])

    # Calculate total amount of fuel consumed
    fuel_consumed = accumulate_consumption(
        track_df[ENVIROCAR_DATA.TRACK_FEATURE_CONSUMPTION], dt)

    # Calculate amount of fuel consumed per 100km in average
    consumption = consumption_per100km(
        track_df[ENVIROCAR_DATA.TRACK_FEATURE_CONSUMPTION], dt, track_df[ENVIROCAR_DATA.TRACK_LENGTH])

    # Calculate average speed
    average_speed = np.average(track_df[ENVIROCAR_DATA.TRACK_FEATURE_SPEED])

    return fuel_consumed, consumption, average_speed


def build_track_feature_point(track_df_row):
    return {
        'measurement': 'trackFeatures',
        'tags': {
            'id': track_df_row[ENVIROCAR_DATA.TRACK_FEATURE_ID],
            'track': track_df_row[ENVIROCAR_DATA.TRACK_ID],
        },
        'time': track_df_row[ENVIROCAR_DATA.TIME],
        'fields': {
            'lat': track_df_row[ENVIROCAR_DATA.TRACK_FEATURE_GEOMETRY].y,
            'lng': track_df_row[ENVIROCAR_DATA.TRACK_FEATURE_GEOMETRY].x,
            'consumption': track_df_row[ENVIROCAR_DATA.TRACK_FEATURE_CONSUMPTION],
            'emissions': track_df_row[ENVIROCAR_DATA.TRACK_FEATURE_EMISSION],
            'speed': track_df_row[ENVIROCAR_DATA.TRACK_FEATURE_SPEED],
        }
    }
