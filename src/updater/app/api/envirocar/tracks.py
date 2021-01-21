import requests


async def get_envirocar_tracks(user, token):
    envirocarTracksRes = requests.get(
        f'https://envirocar.org/api/stable/users/{user}/tracks',
        headers={
            'X-User': user,
            'X-Token': token
        }
    )
    return envirocarTracksRes.json()['tracks']