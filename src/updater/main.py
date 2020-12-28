from fastapi import FastAPI, Header
from pydantic import BaseModel
import requests


class PostNewTracks(BaseModel):
    synchronization: str
    phaseNumber: int


app = FastAPI()


@app.post("/newTracks")
async def post_new_tracks(data: PostNewTracks, x_user: str = Header(None), x_token: str = Header(None)):
    res = requests.get(
        f'https://envirocar.org/api/stable/users/{x_user}/tracks',
        headers={
            'X-User': x_user,
            'X-Token': x_token
        }
    )
    tracks = res.json()['tracks']
    print(tracks)


@app.get("/userExists/{user_id}")
async def get_user_exists(user_id: str):
    res = requests.get(
        f'https://envirocar.org/api/stable/users/{user_id}'
    )
    statusCode = res.json()['statusCode']
    return statusCode == 401
