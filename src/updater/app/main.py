from fastapi import FastAPI, Header
from pydantic import BaseModel
import requests
import os
from datetime import datetime


class PostNewTracks(BaseModel):
    synchronization: str
    user: str
    phaseNumber: int


STRAPI_TOKEN = os.getenv("STRAPI_TOKEN", 'umwukySdOA2huk7Rnjc74NBs7x57z2sU')
STRAPI_URL = os.getenv("STRAPI_URL", 'http://localhost:1337')


SYNCHRONIZATION_STATUSES = {
    'pending': 'pending',
    'success': 'success',
    'failure': 'failure'
}


app = FastAPI()


async def get_envirocar_tracks(user, token):
    envirocarTracksRes = requests.get(
        f'https://envirocar.org/api/stable/users/{user}/tracks',
        headers={
            'X-User': user,
            'X-Token': token
        }
    )
    return envirocarTracksRes.json()['tracks']


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


def filter_tracks(allTracks, existingTracks):
    existingTracksIds = []
    newTracks = []

    for existingTrack in existingTracks:
        existingTracksIds.append(existingTrack['envirocar'])

    for track in allTracks:
        if track['id'] not in existingTracksIds:
            newTracks.append(track)

    return newTracks


def seconds_between(d1, d2):
    d1 = datetime.strptime(d1, "%Y-%m-%dT%H:%M:%SZ")
    d2 = datetime.strptime(d2, "%Y-%m-%dT%H:%M:%SZ")
    return abs((d2 - d1).seconds)


async def update_strapi_tracks(newTracks, user, synchronization):
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
                'synchronization': synchronization
            },
            params={
                'token': STRAPI_TOKEN
            })


@app.post("/newTracks")
async def post_new_tracks(data: PostNewTracks, x_user: str = Header(None), x_token: str = Header(None)):
    allTracks = await get_envirocar_tracks(x_user, x_token)

    if len(allTracks) == 0:
        return {'statusCode': 200, 'message': 'You need to record some driving data first to synchronize them later'}

    existingTracks = await get_strapi_tracks(data.user)

    newTracks = filter_tracks(allTracks, existingTracks)

    newTracksLen = len(newTracks)

    if newTracksLen == 0:
        return {'statusCode': 200, 'message': 'There are no new track records'}

    await update_strapi_tracks(newTracks, data.user, data.synchronization)

    return {'statusCode': 200, 'message': f'There are {newTracksLen} tracks that were potentially processed'}


@app.get("/userCredentialsValid")
async def get_user_exists(x_user: str = Header(None), x_token: str = Header(None)):
    res = requests.get(
        f'https://envirocar.org/api/stable/users/{x_user}',
        headers={
            'X-User': x_user,
            'X-Token': x_token
        }
    )

    data = res.json()

    return {'valid': False if 'statusCode' in data else True}
