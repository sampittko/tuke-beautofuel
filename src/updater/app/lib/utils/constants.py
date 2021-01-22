import os

ENVIROCAR_API = "https://envirocar.org/api/stable"
ENVIROCAR_DATETIME_FORMAT = "%Y-%m-%dT%H:%M:%S+00:00"

STRAPI_TOKEN = os.getenv("STRAPI_TOKEN", 'umwukySdOA2huk7Rnjc74NBs7x57z2sU')
STRAPI_URL = os.getenv("STRAPI_URL", 'http://localhost:1337')

INFLUXDB_HOST = os.getenv("INFLUXDB_HOST", 'localhost')
INFLUXDB_PORT = os.getenv("INFLUXDB_PORT", 8086)
INFLUXDB_DB = os.getenv("INFLUXDB_DB", 'db')
INFLUXDB_USER = os.getenv("INFLUXDB_USER", 'telegraf')
INFLUXDB_PASSWORD = os.getenv("INFLUXDB_PASSWORD", 'secret')
