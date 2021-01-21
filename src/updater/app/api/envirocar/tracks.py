import requests

from ...utils import ENVIROCAR_API


async def get_envirocar_tracks(user, token):
    envirocarTracksRes = requests.get(
        f'{ENVIROCAR_API}/users/{user}/tracks',
        headers={
            'X-User': user,
            'X-Token': token
        }
    )
    return envirocarTracksRes.json()['tracks']
