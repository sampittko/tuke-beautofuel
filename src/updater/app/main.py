from fastapi import FastAPI, Header
from influxdb import InfluxDBClient, DataFrameClient

from lib.packages.envirocar import BboxSelector
from lib.models import PostNewTracks as PostNewTracksModel
from lib.handlers.post_new_tracks import handler as post_new_tracks_handler
from lib.handlers.get_user_credentials_valid import handler as get_user_credentials_valid_handler
from lib.utils.constants import INFLUXDB_HOST, INFLUXDB_PORT, INFLUXDB_USER, INFLUXDB_PASSWORD, INFLUXDB_DB

# Database client
grafanadb = InfluxDBClient(
    host=INFLUXDB_HOST,
    port=INFLUXDB_PORT,
    database=INFLUXDB_DB,
    username=INFLUXDB_USER,
    password=INFLUXDB_PASSWORD
)

# Database client for DataFrame querying
grafanadb_df = DataFrameClient(
    host=INFLUXDB_HOST,
    port=INFLUXDB_PORT,
    database=INFLUXDB_DB,
    username=INFLUXDB_USER,
    password=INFLUXDB_PASSWORD
)

# Boundary box for Slovakia
# bbox = BboxSelector([
#     16.76425013529685,  # min_x
#     47.37325224412486,  # min_y
#     22.594816079401987,  # max_x
#     49.7297265173567  # max_y
# ])

# I have Kuba so I need to include Kraków too lol
bbox = BboxSelector([
    16.76425013529685,  # min_x
    47.37325224412486,  # min_y
    22.901215546816232,  # max_x
    50.488836439759744  # max_y
])

app = FastAPI()


@app.post("/newTracks")
async def post_new_tracks(data: PostNewTracksModel, x_user: str = Header(None), x_token: str = Header(None)):
    return await post_new_tracks_handler(data, x_user, x_token, bbox=bbox, influxdb_client=grafanadb, influxdb_client_df=grafanadb_df)


@app.get("/userCredentialsValid")
async def get_user_credentials_valid(x_user: str = Header(None), x_token: str = Header(None)):
    return await get_user_credentials_valid_handler(x_user, x_token)
