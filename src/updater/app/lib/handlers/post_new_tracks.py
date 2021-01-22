from ..api.envirocar import get_envirocar_tracks, get_envirocar_user, get_envirocar_track
from ..api.strapi import get_strapi_tracks, update_strapi_tracks
from ..utils.functions import seconds_between, filter_tracks


async def handler(data, x_user, x_token, influxdb_client):
    allTracks = await get_envirocar_tracks(x_user, x_token)

    if len(allTracks) == 0:
        print("There are no tracks to synchronize for user with name {}".format(x_user))
        return {'statusCode': 200, 'message': 'You need to record some driving data first to synchronize them later'}
    print("Tracks fetched")

    existingTracks = await get_strapi_tracks(data.user)

    newTracks = filter_tracks(allTracks, existingTracks)
    newTracksCount = len(newTracks)

    if newTracksCount == 0:
        message = 'There are no new track records for user with name {}'.format(
            x_user)
        print(message)
        return {'statusCode': 200, 'message': message}
    print("There are {} new track records for user with name {}".format(
        newTracksCount, x_user))

    try:
        await persist_new_tracks_data(newTracks, x_user, x_token, influxdb_client)
        print("Data persistence completed")
    except ChildProcessError:
        print("Data persistence is incomplete")

    if data.phaseNumber == 2 or data.phaseNumber == 3:
        print("Eco-score calculation not yet implemented")

    await update_strapi_tracks(newTracks, data.user, data.synchronization, data.phaseNumber, data.userGroup)

    return {'statusCode': 200, 'message': f'{newTracksCount} tracks were processed'}


async def persist_new_tracks_data(newTracks, x_user, x_token, influxdb_client):
    tracks = []
    for newTrack in newTracks:
        completeNewTrack = await get_envirocar_track(x_user, x_token, newTrack['id'])

        trackPoint = build_track_point(completeNewTrack)
        tracks.append(trackPoint)

        trackFeatures = []
        for feature in completeNewTrack['features']:
            try:
                trackFeaturePoint = build_track_feature_point(
                    completeNewTrack, feature)
                trackFeatures.append(trackFeaturePoint)
            except ValueError as e:
                print(e.message)

        persistedTrackFeatures = influxdb_client.write_points(trackFeatures)
        if not persistedTrackFeatures:
            try:
                raise ChildProcessError()
            except ChildProcessError as e:
                e.message = "Track features persistence was not successful for track".format(
                    newTrack['id'])
                raise

    persistedTracks = influxdb_client.write_points(tracks)
    if not persistedTracks:
        try:
            raise ChildProcessError()
        except ChildProcessError as e:
            e.message = "Tracks persistence was not successful"
            raise


def build_track_point(completeNewTrack):
    userData = completeNewTrack['properties']['user']
    carData = completeNewTrack['properties']['sensor']['properties']

    return {
        'measurement': 'tracks',
        'tags': {
            'id': completeNewTrack['properties']['id'],
            'user': userData['name'],
            'email': userData['mail'],
            'car': '{} {} {}'.format(
                carData['manufacturer'], carData['model'], carData['constructionYear']),
            'carEngineDisplacement': carData['engineDisplacement'],
        },
        'time': completeNewTrack['properties']['created'],
        'fields': {
            'length': completeNewTrack['properties']['length'],
            'begin': completeNewTrack['properties']['begin'],
            'end': completeNewTrack['properties']['end'],
        }
    }


def build_track_feature_point(completeNewTrack, feature):
    coordinatesData = feature['geometry']['coordinates']
    phenomenonsData = feature['properties']['phenomenons']

    speed = None

    try:
        check_phenomenons_data(phenomenonsData, completeNewTrack, feature)
    except ValueError as e:
        if 'speed' in e.message:
            speed = 0
        else:
            raise

    return {
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
            'emissions': phenomenonsData['CO2 Emission (GPS-based)']['value'],
            'speed': speed or phenomenonsData['GPS Speed']['value'],
        }
    }


def check_phenomenons_data(phenomenonsData, completeNewTrack, feature):
    if not 'Consumption (GPS-based)' in phenomenonsData:
        try:
            raise ValueError()
        except ValueError as e:
            e.message = "Track feature point ID {} has missing consumption inside track ID {}".format(
                feature['properties']['id'], completeNewTrack['properties']['id'])
            raise

    if not 'GPS Speed' in phenomenonsData:
        try:
            raise ValueError()
        except ValueError as e:
            e.message = "Track feature point ID {} has missing speed inside track ID {}".format(
                feature['properties']['id'], completeNewTrack['properties']['id'])
            raise

    if not 'CO2 Emission (GPS-based)' in phenomenonsData:
        print("Track feature point ID {} has missing emissions inside track ID {}".format(
            feature['properties']['id'], completeNewTrack['properties']['id']))
