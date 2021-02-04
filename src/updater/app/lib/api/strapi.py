import requests

from ..utils.constants import STRAPI_TOKEN, STRAPI_URL
from ..utils.functions import seconds_between


async def get_strapi_tracks(data):
    res = requests.get(
        f'{STRAPI_URL}/tracks',
        params={
            'token': STRAPI_TOKEN,
            '_where[user]': data.user,
            '_where[phaseNumber]': data.phaseNumber
        }
    )
    return res.json()


async def update_strapi_tracks(tracks_df, additional_tracks_data, track_ids, data):
    for track_id in track_ids:
        first_coordinate_data = tracks_df[tracks_df['track.id']
                                          == track_id].iloc[0]
        requests.post(
            f'{STRAPI_URL}/tracks',
            json={
                'envirocar': first_coordinate_data['track.id'],
                'duration': seconds_between(first_coordinate_data['track.begin'], first_coordinate_data['track.end']),
                'date': first_coordinate_data['track.begin'],
                'score': additional_tracks_data[track_id]['score'],
                'totalDistance': first_coordinate_data['track.length'],
                'scoreDistance': 0,
                'consumption': additional_tracks_data[track_id]['consumption'],
                'scoreConsumption': 0,
                'fuelConsumed': additional_tracks_data[track_id]['fuelConsumed'],
                'scoreFuelConsumed': 0,
                'speed': additional_tracks_data[track_id]['speed'],
                'scoreSpeed': 0,
                'user': data.user,
                'synchronization': data.synchronization,
                'phaseNumber': data.phaseNumber,
                'userGroup': data.userGroup
            },
            params={
                'token': STRAPI_TOKEN
            })
