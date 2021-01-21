from fastapi import FastAPI, Header
from influxdb import InfluxDBClient

from lib.models import PostNewTracks as PostNewTracksModel
from lib.handlers.post_new_tracks import handler as post_new_tracks_handler
from lib.handlers.get_user_credentials_valid import handler as get_user_credentials_valid_handler
from lib.utils.constants import INFLUXDB_HOST, INFLUXDB_PORT, INFLUXDB_USER, INFLUXDB_PASSWORD


grafanadb = InfluxDBClient(
    host=INFLUXDB_HOST,
    port=INFLUXDB_PORT,
    username=INFLUXDB_USER,
    password=INFLUXDB_PASSWORD
)

app = FastAPI()


@app.post("/newTracks")
async def post_new_tracks(data: PostNewTracksModel, x_user: str = Header(None), x_token: str = Header(None)):
    return await post_new_tracks_handler(data, x_user, x_token, influxdb_client=grafanadb)


@app.get("/userCredentialsValid")
async def get_user_credentials_valid(x_user: str = Header(None), x_token: str = Header(None)):
    return await get_user_credentials_valid_handler(x_user, x_token)
