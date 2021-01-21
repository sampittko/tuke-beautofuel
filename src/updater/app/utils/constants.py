import os

STRAPI_TOKEN = os.getenv("STRAPI_TOKEN", 'umwukySdOA2huk7Rnjc74NBs7x57z2sU')
STRAPI_URL = os.getenv("STRAPI_URL", 'http://localhost:1337')
INFLUXDB_HOST = os.getenv("INFLUXDB_HOST", 'influxdb')
INFLUXDB_PORT = os.getenv("INFLUXDB_PORT", 8086)
INFLUXDB_USER = os.getenv("INFLUXDB_USER", 'telegraf')
INFLUXDB_PASSWORD = os.getenv("INFLUXDB_PASSWORD", 'secret')