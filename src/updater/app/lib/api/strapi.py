import requests

from ..utils.constants import STRAPI_TOKEN, STRAPI_URL
from ..utils.functions import seconds_between


async def get_strapi_tracks(user):
    strapiTracksRes = requests.get(
        f'{STRAPI_URL}/tracks',
        json={
            'user': user
        },
        params={
            'token': STRAPI_TOKEN
        }
    )
    return strapiTracksRes.json()


async def update_strapi_tracks(tracks_df, track_ids, user, synchronization, phaseNumber, userGroup):
    for track_id in track_ids:
        first_coordinate_data = tracks_df[tracks_df['track.id']
                                          == track_id].iloc[0]
        requests.post(
            f'{STRAPI_URL}/tracks',
            json={
                'envirocar': first_coordinate_data['track.id'],
                'duration': seconds_between(first_coordinate_data['track.begin'], first_coordinate_data['track.end']),
                'date': first_coordinate_data['track.begin'],
                'score': 0,
                'totalDistance': first_coordinate_data['track.length'],
                'scoreDistance': 0,
                'user': user,
                'synchronization': synchronization,
                'phaseNumber': phaseNumber,
                'userGroup': userGroup
            },
            params={
                'token': STRAPI_TOKEN
            })
