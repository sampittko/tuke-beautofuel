import requests

from ..utils.constants import ENVIROCAR_API
from ..utils.functions import get_envirocar_headers


async def get_envirocar_tracks(user, token):
    res = requests.get(
        f'{ENVIROCAR_API}/users/{user}/tracks',
        headers=get_envirocar_headers(user, token)
    )
    return res.json()['tracks']


async def get_envirocar_user(user, token):
    res = requests.get(
        f'{ENVIROCAR_API}/users/{user}',
        headers=get_envirocar_headers(user, token)
    )
    return res.json()
