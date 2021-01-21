import requests

from ...utils import ENVIROCAR_API


async def get_envirocar_user(user, token):
    res = requests.get(
        f'{ENVIROCAR_API}/users/{user}',
        headers={
            'X-User': user,
            'X-Token': token
        }
    )

    return res.json()
