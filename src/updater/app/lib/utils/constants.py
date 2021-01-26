from .functions import enum
import os

ENVIROCAR_API = "https://envirocar.org/api/stable"
ENVIROCAR_DATETIME_FORMAT = "%Y-%m-%dT%H:%M:%S+00:00"
ENVIROCAR_DATA = enum(TRACK_FEATURE_SPEED='GPS Speed.value', TRACK_FEATURE_CONSUMPTION='Consumption (GPS-based).value',
                      TRACK_FEATURE_EMISSION='CO2 Emission (GPS-based).value', TRACK_ID="track.id", USER="track.user.name", EMAIL="track.user.mail", CAR_MANUFACTURER="sensor.manufacturer", CAR_MODEL="sensor.model", CAR_CONSTRUCTION='sensor.constructionYear', CAR_ENGINE_DISPLACEMENT='sensor.engineDisplacement', TRACK_BEGIN='track.begin', TRACK_END='track.end', TRACK_CREATED='track.created', TRACK_LENGTH='track.length', TIME='time', TRACK_FEATURE_GEOMETRY='geometry', TRACK_FEATURE_ID="id")

STRAPI_TOKEN = os.getenv("STRAPI_TOKEN", 'umwukySdOA2huk7Rnjc74NBs7x57z2sU')
STRAPI_URL = os.getenv("STRAPI_URL", 'http://localhost:1337')

INFLUXDB_HOST = os.getenv("INFLUXDB_HOST", 'localhost')
INFLUXDB_PORT = os.getenv("INFLUXDB_PORT", 8086)
INFLUXDB_DB = os.getenv("INFLUXDB_DB", 'db')
INFLUXDB_USER = os.getenv("INFLUXDB_USER", 'telegraf')
INFLUXDB_PASSWORD = os.getenv("INFLUXDB_PASSWORD", 'secret')
