from fastapi import FastAPI, Header
from influxdb import InfluxDBClient

from .models import PostNewTracks as PostNewTracksModel
from .api.envirocar.tracks import get_envirocar_tracks
from .api.envirocar.users import get_envirocar_user
from .api.strapi.tracks import get_strapi_tracks, update_strapi_tracks
from .utils.functions import seconds_between, filter_tracks
from .utils.constants import INFLUXDB_HOST, INFLUXDB_PORT, INFLUXDB_USER, INFLUXDB_PASSWORD

grafanadb = InfluxDBClient(
    host=INFLUXDB_HOST,
    port=INFLUXDB_PORT,
    username=INFLUXDB_USER,
    password=INFLUXDB_PASSWORD
)

updater = FastAPI()


@updater.post("/newTracks")
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


@updater.get("/userCredentialsValid")
async def get_user_exists(x_user: str = Header(None), x_token: str = Header(None)):
    data = get_envirocar_user(x_user, x_token)
    return {'valid': False if 'statusCode' in data else True}
