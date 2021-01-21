from ..api.envirocar import get_envirocar_tracks, get_envirocar_user
from ..api.strapi import get_strapi_tracks, update_strapi_tracks
from ..utils.functions import seconds_between, filter_tracks


async def handler(data, x_user, x_token, influxdb_client):
    allTracks = await get_envirocar_tracks(x_user, x_token)

    if len(allTracks) == 0:
        return {'statusCode': 200, 'message': 'You need to record some driving data first to synchronize them later'}

    existingTracks = await get_strapi_tracks(data.user)

    newTracks = filter_tracks(allTracks, existingTracks)

    if len(newTracks) == 0:
        return {'statusCode': 200, 'message': 'There are no new track records'}

    if data.phaseNumber == 1:
        print("jednotecka")
    elif data.phaseNumber == 2 or data.phaseNumber == 3:
        print("dvojecka alebo trojecka")
    else:
        return {'statusCode': 400, 'message': 'Incorrect phase number'}

    await update_strapi_tracks(newTracks, data.user, data.synchronization, data.phaseNumber, data.userGroup)

    return {'statusCode': 200, 'message': f'{len(newTracks)} tracks were processed'}
