
from datetime import datetime


def filter_tracks(tracks_df, existing_tracks):
    existing_track_ids = []

    for existing_track in existing_tracks:
        existing_track_ids.append(existing_track['envirocar'])

    track_ids = tracks_df['track.id'].unique()

    if len(existing_track_ids) == 0:
        return tracks_df, track_ids

    if len(existing_track_ids) == len(track_ids):
        return tracks_df.iloc[0:0], None

    return tracks_df.drop(index=existing_track_ids, errors='ignore'), track_ids


def seconds_between(d1, d2):
    d1 = datetime.strptime(d1, "%Y-%m-%dT%H:%M:%SZ")
    d2 = datetime.strptime(d2, "%Y-%m-%dT%H:%M:%SZ")
    return abs((d2 - d1).seconds)


def get_envirocar_headers(user, token):
    return {
        'X-User': user,
        'X-Token': token
    }
