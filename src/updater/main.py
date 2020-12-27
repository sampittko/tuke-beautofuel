from fastapi import FastAPI

app = FastAPI()


@app.get("/newTracks")
async def read_item(user: str, token: str):
    return {"user": user, "token": token}
