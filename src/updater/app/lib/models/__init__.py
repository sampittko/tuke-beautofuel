from pydantic import BaseModel
from typing import Optional


class PostNewTracks(BaseModel):
    synchronization: str
    user: str
    userGroup: Optional[str] = None
    phaseStartDate: str
    phaseEndDate: str
    phaseNumber: int
