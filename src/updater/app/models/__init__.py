from pydantic import BaseModel


class PostNewTracks(BaseModel):
    synchronization: str
    user: str
    userGroup: str
    phaseNumber: int
