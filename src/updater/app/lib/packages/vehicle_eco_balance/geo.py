import numpy as np
import requests as req
from requests.exceptions import HTTPError
import time
from geopy import distance
import osmnx as ox


def calc_gradient_angle(point1, point2):
    """ Calculate the gradient angle between two points on the earth's surface

    Parameters
    ----------
    point1: tuple (latitude, longitude, altitude)
        first coordinate
    point2: tuple (latitude, longitude, altitude)
        second coordinate

    Returns
    -------
    gradient_angle: float
        gradient angle in radians between -pi/2 and pi/2
    """

    coord1, alt1 = point1[:-1], point1[-1]
    coord2, alt2 = point2[:-1], point2[-1]

    dist = calc_distance(coord1, coord2)

    if dist != 0:
        return np.arctan((alt2 - alt1) / dist)
    else:
        return 0.0


def calc_distance(coord1, coord2, distance_type="geodetic", ellipsoid="WGS-84"):
    """ Calculate distance between two points on the earth's surface using geopy

    Great-circle distance is calculated using Vincenty's formula.
    Default ellipsoid of the geodetic distance is WGS-84.

    Parameters
    ----------
    coord1: tuple (latitude, longitude)
        first coordinate
    coord2: tuple (latitude, longitude)
        second coordinate
    distance_type: str
        'geodetic' or 'great-circle' (default 'geodetic')
    ellipsoid: str
        ellipsoid for geodetic distance (default 'WGS-84')

    Returns
    -------
    distance: float
        distance in meters
    """

    if distance_type == "geodetic":
        return distance.geodesic(coord1, coord2, ellipsoid=ellipsoid).km * 1000
    elif distance_type == "great-circle":
        return distance.great_circle(coord1, coord2).km * 1000
    else:
        print("distance_type " + distance_type + " is unknown!")


class ElevationAPI:
    """
    ElevationAPI

    Example APIs:
    - Open Topo Data (https://www.opentopodata.org/)
       - API: https://api.opentopodata.org/v1/
       - Open
       - Example: https://api.opentopodata.org/v1/eudem25m?locations=39.7391536,-104.9847034
       - Limits
          - Max 100 locations per request.
          - Max 1 call per second.
          - Max 1000 calls per day.
    - Google Elevation API (https://developers.google.com/maps/documentation/elevation/overview)
       - API: https://maps.googleapis.com/maps/api/elevation/
       - Commercial, API key needed
       - Example: https://maps.googleapis.com/maps/api/elevation/json?locations=39.7391536,-104.9847034&key=YOUR_API_KEY

    Parameters
    ----------
    base_url: str
        API base url (default 'https://api.opentopodata.org/v1/')
    dataset: str
        eudem25m, aster30m, srtm30m, ... (default 'eudem25m', check https://www.opentopodata.org/ for details)
    api_key: str (default None)
        API key for the service

    Attributes
    ----------
    base_url: str
        API base url
    location_limit: int
        number of allowed locations per request
    params: dictionary
        parameters for the get request (e.g. locations, key)
    """

    def __init__(self, base_url='https://api.opentopodata.org/v1/', dataset='eudem25m', api_key=None):

        self.base_url = base_url
        if self.base_url != 'https://api.opentopodata.org/v1/':
            self.location_limit = None
        else:
            self.location_limit = 100
            self.base_url = self.base_url + dataset
        self.params = {'key': api_key}

    def get_elevation(self, coordinates):
        """ Get elevation for the given coordinates from an elevation API

        Parameters
        ----------
        coordinates: list of tuples (latitude, longitude)
            coordinates in EPSG:4326 (WGS-84)

        Returns
        -------
        elevation: numpy array
            elevation for each coordinate
        """

        elevation = np.zeros(len(coordinates))

        if self.location_limit is None:
            print('Download elevation for all {} coordinates'.format(len(coordinates)))
            elevation[0, len(coordinates)] = self._make_request(coordinates)
            return elevation

        # Split request into multiple requests if location limit is provided
        for i in range(int(len(coordinates) / self.location_limit) + 1):
            start = i * self.location_limit
            end = (i + 1) * self.location_limit
            print('Download elevation for coordinates {start} to {end}'.format(start=start + 1, end=end))
            elevation[start:end] = self._make_request(coordinates[start:end])
            time.sleep(1)  # for OpenTopoData the limit is max 1 call per second

        return elevation

    def _make_request(self, coordinates):
        locations_str = self._coordinates2param(coordinates)
        self.params.update({'locations': locations_str})
        elevation_list = []

        try:
            response = req.get(self.base_url, params=self.params)
            response.raise_for_status()
        except HTTPError as http_err:
            print('An http error occurred during the request: {}'.format(http_err))
        except Exception as err:
            print('An error occurred during the request: {}'.format(err))
        else:
            results = response.json()['results']
            elevation_list = [result['elevation'] for result in results]

        return elevation_list

    def _coordinates2param(self, coordinates):
        """ Transform coordinates to string in order to set the locations request parameter """
        return ''.join([str(coordinate[0]) + ',' + str(coordinate[1]) + '|' for coordinate in coordinates])


def get_cr_from_osm(coordinates):
    """ Get rolling coefficient (cr) from osm surface attribute

    1) Determine nearest osm edge for each coordinate
    2) Determine surface attribute for each osm edge
    3) Get rolling coefficient (cr) for the corresponding surface type from literature

    Hint: function will take some time when coordinates have a large spatial extent.

    Parameters
    ----------
    coordinates: list of tuples (latitude, longitude)
        coordinates

    Returns
    -------
    [cr, surface]: list of numpy arrays
        first array are rolling coefficient (cr) values and second array are surface attributes
    """

    # TODO: Improve performance
    # TODO: Check scientific literature for rolling coefficient values

    lats = [coordinate[0] for coordinate in coordinates]
    lngs = [coordinate[1] for coordinate in coordinates]

    min_y = np.min(lats)
    max_y = np.max(lats)
    min_x = np.min(lngs)
    max_x = np.max(lngs)

    ox.settings.useful_tags_way = ["surface"]

    print('Get graph from bounding box: min_y={}, max_y={}, min_x={}, max_x={}'.format(min_y, max_y, min_x, max_x))
    graph = ox.graph_from_bbox(max_y, min_y, max_x, min_x, network_type='drive')

    surface = []
    cr = []
    i = 0

    print('Find nearest osm edge and set rolling coefficient according to the surface type of the edge.')
    for lat, lng in coordinates:

        x = ox.get_nearest_edge(graph, (lat, lng))
        p = [x[0], x[1]]
        a = ox.utils_graph.get_route_edge_attributes(graph, p)
        dic = a[0]

        if "surface" in dic:
            surface.append(dic["surface"])
        else:
            surface.append(None)

        # Get the rolling resistance coefficient
        # Sources
        # https://www.engineeringtoolbox.com/rolling-friction-resistance-d_1303.html
        # The Automotive Chassis book
        if surface[i] == "asphalt":
            cr.append(0.02)
        elif surface[i] == "cobblestone":
            cr.append(0.015)
        elif surface[i] == "paving_stones":
            cr.append(0.033)
        else:
            cr.append(0.02)
        i = i + 1

    return [np.array(cr), np.array(surface)]
