
from datetime import datetime


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


def get_envirocar_headers(user, token):
    return {
        'X-User': user,
        'X-Token': token
    }
