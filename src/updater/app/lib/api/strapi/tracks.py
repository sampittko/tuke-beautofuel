import requests
from ...utils.functions import seconds_between
from ...utils.constants import STRAPI_TOKEN, STRAPI_URL


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


async def update_strapi_tracks(newTracks, user, synchronization, phaseNumber, userGroup):
    for newTrack in newTracks:
        requests.post(
            f'{STRAPI_URL}/tracks',
            json={
                'envirocar': newTrack['id'],
                'duration': seconds_between(newTrack['begin'], newTrack['end']),
                'date': newTrack['begin'],
                'score': 1,
                'totalDistance': newTrack['length'],
                'scoreDistance': 0,
                'user': user,
                'synchronization': synchronization,
                'phaseNumber': phaseNumber,
                'userGroup': userGroup
            },
            params={
                'token': STRAPI_TOKEN
            })
