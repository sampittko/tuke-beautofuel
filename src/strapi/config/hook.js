module.exports = {
  settings: {
    influxdb: {
      enabled: true,
      url: process.env.INFLUXDB_URL,
      token: process.env.INFLUXDB_TOKEN,
      bucket: process.env.INFLUXDB_BUCKET,
    },
  },
};
