import pandas as pd
import geopandas as gpd
from datetime import datetime, timedelta
import geopy.distance

from ..packages.envirocar import TrackAPI, TimeSelector, ECConfig
from ..packages.eda_quality import correction as correct
from ..packages.eda_quality import manipulation as manipulate

from ..api.envirocar import get_envirocar_tracks, get_envirocar_user, get_envirocar_track
from ..api.strapi import get_strapi_tracks, update_strapi_tracks
from ..utils.functions import seconds_between, filter_tracks
from ..utils.constants import ENVIROCAR_DATETIME_FORMAT


async def handler(data, x_user, x_token, bbox, influxdb_client):
    time_interval, track_api = initialize_pipeline(data, x_user, x_token)

    tracks_df = track_api.get_tracks(bbox=bbox, time_interval=time_interval)

    if tracks_df.empty:
        print("There are no tracks to synchronize for user with name {}".format(x_user))
        return {'statusCode': 200, 'message': 'You need to record some driving data first to synchronize them later'}
    print("Tracks fetched")

    tracks_df = clean_data(tracks_df)

    existing_tracks = await get_strapi_tracks(data.user)

    tracks_df = filter_tracks(tracks_df, existing_tracks)

    if tracks_df.empty:
        message = 'There are no new track records for user with name {}'.format(
            x_user)
        print(message)
        return {'statusCode': 200, 'message': message}

    track_ids = tracks_df['track.id'].unique()
    tracks_count = len(track_ids)
    print("There are {} new track records for user with name {}".format(
        tracks_count, x_user))

    try:
        await persist_new_tracks_data(tracks_df, track_ids, x_user, x_token, influxdb_client)
        print("Data persistence completed")
    except ChildProcessError:
        print("Data persistence is incomplete")

    if data.phaseNumber == 2 or data.phaseNumber == 3:
        print("Eco-score calculation not yet implemented")

    await update_strapi_tracks(tracks_df, track_ids, data.user, data.synchronization, data.phaseNumber, data.userGroup)

    return {'statusCode': 200, 'message': f'{tracks_count} tracks were processed'}

# "{}T00:00:00+00:00".format(data.phaseStartDate)


def initialize_pipeline(data, x_user, x_token):
    phase_start_time = datetime.strptime(
        "2020-01-12T00:00:00+00:00", ENVIROCAR_DATETIME_FORMAT)
    now_time = datetime.now().strftime(ENVIROCAR_DATETIME_FORMAT)
    time_interval = TimeSelector(
        start_time=phase_start_time, end_time=now_time)

    config = ECConfig(username=x_user, password=x_token, reset=True)

    track_api = TrackAPI()

    return time_interval, track_api


def clean_data(tracks_df):
    # Drop duplicated rows
    tracks_df = correct.drop_duplicates(tracks_df)
    # Remove tracks that exceed 8 hours of duration time
    _, tracks_df, _ = correct.exceed_eight_hours(tracks_df, flag=False)
    # Remove tracks that falls below x minutes of duration time
    _, tracks_df, _ = correct.below_x_min(tracks_df, x=3, flag=False)
    # Remove tracks that exceed 250 km/h speed
    _, tracks_df, _ = correct.implausible_max_speed(tracks_df, flag=False)
    # Drop unit colums since we are not interested in them
    manipulate.drop_unit_columns(tracks_df).head()

    return tracks_df


async def persist_new_tracks_data(tracks_df, track_ids, x_user, x_token, influxdb_client):
    tracks = []
    for track_id in track_ids:
        track_df = tracks_df.filter(like=track_id, axis="index")

        track_point = build_track_point(track_df)
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


def build_track_point(track_df):
    first_coordinate_data = track_df.iloc[0]

    return {
        'measurement': 'tracks',
        'tags': {
            'id': first_coordinate_data['track.id'],
            'user': first_coordinate_data['track.user.name'],
            'email': first_coordinate_data['track.user.mail'],
            'car': '{} {} {}'.format(
                first_coordinate_data['sensor.manufacturer'], first_coordinate_data['sensor.model'], first_coordinate_data['sensor.constructionYear']),
            'carEngineDisplacement': first_coordinate_data['sensor.engineDisplacement'],
        },
        'time': first_coordinate_data['track.created'],
        'fields': {
            'length': first_coordinate_data['track.length'],
            'begin': first_coordinate_data['track.begin'],
            'end': first_coordinate_data['track.end'],
        }
    }


def build_track_feature_point(track_df_row):
    speed = None

    try:
        check_phenomenons_data(track_df_row)
    except ValueError as e:
        if 'speed' in e.message:
            speed = 0
        else:
            raise

    return {
        'measurement': 'trackFeatures',
        'tags': {
            'id': track_df_row['id'],
            'track': track_df_row['track.id'],
        },
        'time': track_df_row['time'],
        'fields': {
            'lat': track_df_row['geometry'].y,
            'lng': track_df_row['geometry'].x,
            'consumption': track_df_row['Consumption (GPS-based).value'],
            'emissions': track_df_row['CO2 Emission (GPS-based).value'],
            'speed': speed or track_df_row['GPS Speed.value'],
        }
    }


def check_phenomenons_data(track_df_row):
    if type(track_df_row['Consumption (GPS-based).value']) != float:
        try:
            raise ValueError()
        except ValueError as e:
            e.message = "Track feature point ID {} has missing consumption inside track ID {}".format(
                track_df_row['id'], track_df_row['track.id'])
            raise

    if type(track_df_row['GPS Speed.value']) != float:
        try:
            raise ValueError()
        except ValueError as e:
            e.message = "Track feature point ID {} has missing speed inside track ID {}".format(
                track_df_row['id'], track_df_row['track.id'])
            raise

    if type(track_df_row['CO2 Emission (GPS-based).value']) != float:
        print("Track feature point ID {} has missing emissions inside track ID {}".format(
            track_df_row['id'], track_df_row['track.id']))
