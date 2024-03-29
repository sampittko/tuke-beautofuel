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
from ..api.strapi import get_strapi_tracks, update_strapi_tracks, get_strapi_phase_1_tracks_count
from ..utils.functions import seconds_between, float_round_2
from ..utils.constants import ENVIROCAR_DATETIME_FORMAT, ENVIROCAR_DATA, PHASE_1_MIN_TRACKS, COMPONENT_1_WEIGHT, COMPONENT_2_WEIGHT, COMPONENT_3_WEIGHT, COMPONENT_4_WEIGHT


async def handler(data, x_user, x_token, bbox, influxdb_client):
    time_interval, track_api = initialize_pipeline(data, x_user, x_token)

    tracks_df = track_api.get_tracks(bbox=bbox, time_interval=time_interval)

    if tracks_df.empty:
        print("User {} does not have any tracks records".format(x_user))
        return handler_success('No track records')
    print("Processing tracks synchronization request for user", x_user)
    print()

    # TODO Move below and set flag for incompatible track so that it is not being refetched and cleaned every time
    tracks_df = clean_data(tracks_df)

    if tracks_df.empty:
        message = 'New tracks: 0'
        print(message)
        return handler_success(message)

    track_ids = tracks_df[ENVIROCAR_DATA.TRACK_ID].unique()
    tracks_count = len(track_ids)

    if data.phaseNumber != 1:
        existing_phase_1_tracks_count = await get_strapi_phase_1_tracks_count(data)

        if existing_phase_1_tracks_count < PHASE_1_MIN_TRACKS:
            message = '{} new tracks but {} tracks recorded during phase 1'.format(
                tracks_count, existing_phase_1_tracks_count)
            print(message)
            return handler_success(message)

    existing_tracks = await get_strapi_tracks(data)

    tracks_df, track_ids = filter_tracks(tracks_df, existing_tracks, data)
    additional_tracks_data = None
    tracks_count = len(track_ids)

    try:
        additional_tracks_data = await persist_new_tracks_data(tracks_df, track_ids, x_user, x_token, data, influxdb_client)
        print("New tracks inserted into Grafana")
    except ChildProcessError:
        print("Not all new tracks were inserted into Grafana")

    await update_strapi_tracks(tracks_df, additional_tracks_data, track_ids, data)
    print("New tracks inserted into Strapi")
    print()

    return handler_success(f'Processed tracks: {tracks_count}')


def initialize_pipeline(data, x_user, x_token):
    phase_start_time = parser.parse(
        data.phaseStartDate).strftime(ENVIROCAR_DATETIME_FORMAT)
    now_time = datetime.now().strftime(ENVIROCAR_DATETIME_FORMAT)
    time_interval = TimeSelector(
        start_time=phase_start_time, end_time=now_time)

    config = ECConfig(username=x_user, password=x_token, reset=True)

    track_api = TrackAPI()

    return time_interval, track_api


def clean_data(tracks_df):
    # Drop duplicated rows
    tracks_df = correct.drop_duplicates(tracks_df)
    # Fill NaN values
    tracks_df = tracks_df.fillna(tracks_df.mean())
    # Remove tracks that exceed 8 hours of duration time
    _, tracks_df, _ = correct.exceed_eight_hours(tracks_df, flag=False)
    # Remove tracks that falls below x minutes of duration time
    _, tracks_df, _ = correct.below_x_min(tracks_df, x=2, flag=False)
    # Remove tracks that exceed 250 km/h speed
    _, tracks_df, _ = correct.implausible_max_speed(tracks_df, flag=False)
    # Drop unit colums since we are not interested in them
    manipulate.drop_unit_columns(tracks_df).head()

    print()

    return tracks_df


def filter_tracks(tracks_df, existing_tracks, data):
    existing_track_ids = []

    track_ids = tracks_df[ENVIROCAR_DATA.TRACK_ID].unique()

    print("Tracks before filtering:", len(track_ids))

    for existing_track in existing_tracks:
        existing_track_ids.append(existing_track['envirocar'])

    # No tracks are uploaded
    if len(existing_track_ids) == 0:
        print("Tracks after filtering:", len(track_ids))
        print()
        return tracks_df, track_ids

    # Some tracks or all tracks are uploaded
    for existing_track_id in existing_track_ids:
        tracks_df = tracks_df[tracks_df[ENVIROCAR_DATA.TRACK_ID]
                              != existing_track_id]

    track_ids = tracks_df[ENVIROCAR_DATA.TRACK_ID].unique()
    print("Tracks count after filtering:", len(track_ids))
    print()

    return tracks_df, track_ids


async def persist_new_tracks_data(tracks_df, track_ids, x_user, x_token, data, influxdb_client):
    additional_tracks_data = {}
    phase_1_consumptions = None

    if data.phaseNumber == 2 or data.phaseNumber == 3:
        phase_1_consumptions = query_phase_1_consumptions(
            x_user, influxdb_client)

    influx_tracks = []
    for track_id in track_ids:
        track_df = tracks_df[tracks_df[ENVIROCAR_DATA.TRACK_ID] == track_id]

        additional_tracks_data = calculate_track_data(
            track_df, additional_tracks_data, track_id)

        if phase_1_consumptions:
            additional_tracks_data[track_id] = get_track_eco_score(
                additional_tracks_data[track_id], phase_1_consumptions)

        track_point = build_track_point(
            track_df, additional_tracks_data[track_id], data)
        influx_tracks.append(track_point)

        influx_track_features = []
        for _, track_df_row in track_df.iterrows():
            try:
                track_feature_point = build_track_feature_point(
                    track_df_row, data)
                influx_track_features.append(track_feature_point)
            except ValueError as e:
                print(e.message)

        track_features_persisted = influxdb_client.write_points(
            influx_track_features)
        if not track_features_persisted:
            try:
                raise ChildProcessError()
            except ChildProcessError as e:
                e.message = "Track features persistence for track ID {} was not successful for track".format(
                    track_id)
                raise

    tracks_persisted = influxdb_client.write_points(influx_tracks)
    if not tracks_persisted:
        try:
            raise ChildProcessError()
        except ChildProcessError as e:
            e.message = "Tracks persistence was not successful"
            raise

    return additional_tracks_data


def query_phase_1_consumptions(x_user, influxdb_client):
    # Consumption queries
    stdddev_consumption_query = "SELECT stddev(\"consumption\") {};".format(
        get_query_end(x_user))
    mean_consumption_query = "SELECT mean(\"consumption\") {};".format(
        get_query_end(x_user))
    min_consumption_query = "SELECT min(\"consumption\") {};".format(
        get_query_end(x_user))
    max_consumption_query = "SELECT max(\"consumption\") {};".format(
        get_query_end(x_user))

    # Execute consumption queries
    stddev_consumption = get_query_result_value(
        influxdb_client.query(stdddev_consumption_query), 'stddev')
    mean_consumption = get_query_result_value(
        influxdb_client.query(mean_consumption_query), 'mean')
    min_consumption = get_query_result_value(
        influxdb_client.query(min_consumption_query), 'min')
    max_consumption = get_query_result_value(
        influxdb_client.query(max_consumption_query), 'max')

    return {
        'stddev': stddev_consumption,
        'mean': mean_consumption,
        'min': min_consumption,
        'max': max_consumption
    }


def calculate_track_data(track_df, additional_tracks_data, track_id):
    # Calculate interval times
    dt = np.zeros(len(track_df[ENVIROCAR_DATA.TIME]))
    for i in range(1, len(track_df[ENVIROCAR_DATA.TIME])):
        dt[i] = get_interval_time(
            track_df[ENVIROCAR_DATA.TIME].iloc[i], track_df[ENVIROCAR_DATA.TIME].iloc[i-1])

    # Calculate total amount of fuel consumed
    fuel_consumed = accumulate_consumption(
        track_df[ENVIROCAR_DATA.TRACK_FEATURE_CONSUMPTION], dt)
    fuel_consumed = float_round_2(fuel_consumed)

    # Calculate amount of fuel consumed per 100km in average
    consumption = consumption_per100km(
        track_df[ENVIROCAR_DATA.TRACK_FEATURE_CONSUMPTION], dt, track_df[ENVIROCAR_DATA.TRACK_LENGTH])
    consumption = float_round_2(consumption[0])

    # Calculate average speed
    average_speed = np.average(
        track_df[ENVIROCAR_DATA.TRACK_FEATURE_SPEED])
    average_speed = float_round_2(average_speed)

    additional_tracks_data[track_id] = {
        'fuelConsumed': fuel_consumed,
        'consumption': consumption,
        'speed': average_speed
    }

    return additional_tracks_data


def get_track_eco_score(additional_track_data, phase_1_consumptions):
    track_2_consumption = additional_track_data['consumption']

    component_1 = None
    component_2 = None
    component_3 = None
    component_4 = None

    lower_consumption_threshold = phase_1_consumptions['mean'] - \
        phase_1_consumptions['stddev']
    upper_consumption_threshold = phase_1_consumptions['mean'] + \
        phase_1_consumptions['stddev']

    if track_2_consumption >= upper_consumption_threshold:
        component_1 = 0
    elif track_2_consumption <= lower_consumption_threshold:
        component_1 = 100
    else:
        component_1 = 100 - int(
            (track_2_consumption / upper_consumption_threshold) * 100)

    if track_2_consumption < phase_1_consumptions['min']:
        component_2 = 100
    else:
        component_2 = 0

    if track_2_consumption < phase_1_consumptions['mean']:
        component_3 = 100
    else:
        component_3 = 0

    if track_2_consumption < phase_1_consumptions['max']:
        component_4 = 100
    else:
        component_4 = 0

    additional_track_data['score'] = int(component_1 * COMPONENT_1_WEIGHT + component_2 * COMPONENT_2_WEIGHT +
                                         component_3 * COMPONENT_3_WEIGHT + component_4 * COMPONENT_4_WEIGHT)

    return additional_track_data


def get_query_end(user):
    return "FROM \"tracks\" WHERE (\"phase\"='1' AND \"user\"='{}')".format(user)


def get_query_result_value(result, field):
    return list(result.get_points())[0][field]


def build_track_point(track_df, additional_track_data, data):
    first_coordinate_data = track_df.iloc[0]

    return {
        'measurement': 'tracks',
        'tags': {
            'id': first_coordinate_data[ENVIROCAR_DATA.TRACK_ID],
            'user': first_coordinate_data[ENVIROCAR_DATA.USER],
            'email': first_coordinate_data[ENVIROCAR_DATA.EMAIL],
            'car': '{} {} {}'.format(
                first_coordinate_data[ENVIROCAR_DATA.CAR_MANUFACTURER], first_coordinate_data[ENVIROCAR_DATA.CAR_MODEL], first_coordinate_data[ENVIROCAR_DATA.CAR_CONSTRUCTION]),
            'carEngineDisplacement': first_coordinate_data[ENVIROCAR_DATA.CAR_ENGINE_DISPLACEMENT],
            'phase': data.phaseNumber,
            'strategy': data.userGroup
        },
        'time': first_coordinate_data[ENVIROCAR_DATA.TRACK_CREATED],
        'fields': {
            'length': first_coordinate_data[ENVIROCAR_DATA.TRACK_LENGTH],
            'scoreLength': 0,
            'duration': seconds_between(first_coordinate_data[ENVIROCAR_DATA.TRACK_BEGIN], first_coordinate_data[ENVIROCAR_DATA.TRACK_END]),
            'scoreDuration': 0,
            'consumption': additional_track_data['consumption'],
            'scoreConsumption': 0,
            'speed': additional_track_data['speed'],
            'scoreSpeed': 0,
            'score': additional_track_data['score'] if 'score' in additional_track_data else 0,
            'scoreFuelConsumed': 0,
            'fuelConsumed': additional_track_data['fuelConsumed'],
            'begin': first_coordinate_data[ENVIROCAR_DATA.TRACK_BEGIN],
            'end': first_coordinate_data[ENVIROCAR_DATA.TRACK_END]
        }
    }


def build_track_feature_point(track_df_row, data):
    return {
        'measurement': 'trackFeatures',
        'tags': {
            'id': track_df_row[ENVIROCAR_DATA.TRACK_FEATURE_ID],
            'track': track_df_row[ENVIROCAR_DATA.TRACK_ID],
            'user': track_df_row[ENVIROCAR_DATA.USER],
            'email': track_df_row[ENVIROCAR_DATA.EMAIL],
            'car': '{} {} {}'.format(
                track_df_row[ENVIROCAR_DATA.CAR_MANUFACTURER], track_df_row[ENVIROCAR_DATA.CAR_MODEL], track_df_row[ENVIROCAR_DATA.CAR_CONSTRUCTION]),
            'carEngineDisplacement': track_df_row[ENVIROCAR_DATA.CAR_ENGINE_DISPLACEMENT],
            'phase': data.phaseNumber,
            'strategy': data.userGroup
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


def handler_success(message):
    print("Request completed")
    return {'statusCode': 200, 'message': message}
