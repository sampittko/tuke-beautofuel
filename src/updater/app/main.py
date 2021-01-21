from fastapi import FastAPI, Header
import requests
from influxdb import InfluxDBClient


grafanadb = InfluxDBClient(
    host=INFLUXDB_HOST,
    port=INFLUXDB_PORT,
    username=INFLUXDB_USER,
    password=INFLUXDB_PASSWORD
)

app = FastAPI()

@app.post("/newTracks")
async def post_new_tracks(data: PostNewTracksModel, x_user: str = Header(None), x_token: str = Header(None)):
    allTracks = await get_envirocar_tracks(x_user, x_token)

    if len(allTracks) == 0:
        return {'statusCode': 200, 'message': 'You need to record some driving data first to synchronize them later'}

    existingTracks = await get_strapi_tracks(data.user)

    newTracks = filter_tracks(allTracks, existingTracks)

    newTracksLen = len(newTracks)

    if newTracksLen == 0:
        return {'statusCode': 200, 'message': 'There are no new track records'}

    await update_strapi_tracks(newTracks, data.user, data.synchronization, data.phaseNumber, data.userGroup)

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
