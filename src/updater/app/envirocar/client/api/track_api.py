import json
import pandas as pd
import geopandas as gpd

from ..request_param import RequestParam, BboxSelector, TimeSelector
from ..download_client import DownloadClient
from ..client_config import ECConfig


class TrackAPI():
    """Handles the API access to the enviroCar backend and returns queried results as dataframes"""
    TRACKS_ENDPOINT = "tracks"
    TRACK_ENDPOINT = "tracks/{}"
    USERTRACKS_ENDPOINT = "users/{}/tracks"

    def __init__(self):
        self.api_client = DownloadClient()
        self.config = ECConfig()

    def get_tracks(self, num_results=100, page_limit=100):
        path = self._get_path(username=self.config.ec_username)

        # creating download_requests
        download_requests = []
        current_results = 0
        current_page = 1
        while current_results < num_results:
            request_params = {
                'limit': page_limit,
                'page': current_page
            }

            request = RequestParam(path=path, params=request_params)
            download_requests.append(request)

            current_results += page_limit
            current_page += 1

        # request for /tracks
        tracks_meta_df = self.api_client.download(
            download_requests, decoder=_parse_tracks_list_df)
        tracks_meta_df = tracks_meta_df[:num_results]

        if not tracks_meta_df.empty:
            ids = tracks_meta_df['track.id'].values
            tracks_df = self._get_tracks_by_ids(ids)
            return tracks_df

        return gpd.GeoDataFrame()

    def get_track(self, track_id: str):
        return self.api_client.download(
            RequestParam(path=self._get_path(trackid=track_id)),
            decoder=_parse_track_df)

    def _get_tracks_by_ids(self, ids: [str]):
        download_requests = [RequestParam(
            path=self._get_path(trackid=id)) for id in ids]
        return self.api_client.download(download_requests, decoder=_parse_track_df)

    def _get_path(self, *, username=None, trackid=None):
        if username is None and trackid is None:
            return self.TRACKS_ENDPOINT
        if username:
            return self.USERTRACKS_ENDPOINT.format(username)
        if trackid:
            return self.TRACK_ENDPOINT.format(trackid)


def _parse_tracks_list_df(tracks_jsons):
    if not isinstance(tracks_jsons, list):
        tracks_jsons = [tracks_jsons]

    tracks_meta_df = pd.DataFrame()
    for tracks_json in tracks_jsons:
        if tracks_json:
            ec_data = json.loads(tracks_json)
            df = pd.json_normalize(ec_data, 'tracks')
            df.rename(columns=__rename_track_columns, inplace=True)
            tracks_meta_df = tracks_meta_df.append(df)

    return tracks_meta_df


def _parse_track_df(track_jsons):
    if not isinstance(track_jsons, list):
        track_jsons = [track_jsons]

    tracks_df = gpd.GeoDataFrame()
    for track_json in track_jsons:
        # read properties
        car_df = pd.json_normalize(json.loads(track_json)['properties'])
        car_df.columns = car_df.columns.str.replace(
            'sensor.properties.', 'sensor.')
        car_df.rename(columns=__rename_track_columns, inplace=True)

        # read geojson values
        track_df = gpd.read_file(track_json)
        track_df = track_df.join(pd.json_normalize(
            track_df['phenomenons'])).drop(['phenomenons'], axis=1)

        # combine dataframes
        car_df = pd.concat([car_df]*len(track_df.index), ignore_index=True)
        tracks_df = tracks_df.append(track_df.join(car_df))

    return tracks_df


def __rename_track_columns(x):
    if not x.startswith('sensor'):
        return 'track.' + x
    return x
