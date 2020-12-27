from fastapi import FastAPI, Header
import requests


app = FastAPI()


@app.get("/newTracks")
async def get_new_tracks(x_user: str = Header(None), x_token: str = Header(None)):
    res = requests.get(
        f'https://envirocar.org/api/stable/users/{x_user}/tracks',
        headers={
            'X-User': x_user,
            'X-Token': x_token
        }
    )
    return res.json()


@app.get("/userExists/{user_id}")
async def get_user_exists(user_id: str):
    res = requests.get(
        f'https://envirocar.org/api/stable/users/{user_id}'
    )
    statusCode = res.json()['statusCode']
    return statusCode == 401
