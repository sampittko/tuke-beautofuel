from ..api.envirocar import get_envirocar_tracks, get_envirocar_user, get_envirocar_track
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

    tracks = []
    for newTrack in newTracks:
        completeNewTrack = await get_envirocar_track(x_user, x_token, newTrack['id'])

        userData = completeNewTrack['properties']['user']
        carData = completeNewTrack['properties']['sensor']['properties']

        tracks.append({
            'measurement': 'tracks',
            'tags': {
                'id': completeNewTrack['properties']['id'],
                'user': userData['name'],
                'email': userData['mail'],
            },
            'time': completeNewTrack['properties']['created'],
            'fields': {
                'length': completeNewTrack['properties']['length'],
                'car': '{} {} {}'.format(
                    carData['manufacturer'], carData['model'], carData['constructionYear']),
                'carEngineDisplacement': carData['engineDisplacement'],
            }
        })

        trackFeatures = []
        for feature in completeNewTrack['features']:

            coordinatesData = feature['geometry']['coordinates']
            phenomenonsData = feature['properties']['phenomenons']

            if not 'Consumption (GPS-based)' in phenomenonsData or not 'GPS Speed' in phenomenonsData:
                continue

            trackFeatures.append({
                'measurement': 'trackFeatures',
                'tags': {
                    'id': feature['properties']['id'],
                    'track': completeNewTrack['properties']['id'],
                },
                'time': feature['properties']['time'],
                'fields': {
                    'lat': coordinatesData[1],
                    'lng': coordinatesData[0],
                    'consumption': phenomenonsData['Consumption (GPS-based)']['value'],
                    'speed': phenomenonsData['GPS Speed']['value'],
                }
            })

        influxdb_client.write_points(trackFeatures)
    influxdb_client.write_points(tracks)

    if data.phaseNumber == 2 or data.phaseNumber == 3:
        print("Pipeline not yet implemented")

    # await update_strapi_tracks(newTracks, data.user, data.synchronization, data.phaseNumber, data.userGroup)

    return {'statusCode': 200, 'message': f'{len(newTracks)} tracks were processed'}
