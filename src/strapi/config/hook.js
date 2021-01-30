module.exports = {
  settings: {
    influxdb:
      process.env.ON_VPS === 1
        ? {
            enabled: true,
            url: process.env.INFLUXDB_URL,
            token: process.env.INFLUXDB_TOKEN,
            bucket: process.env.INFLUXDB_BUCKET,
          }
        : {
            enabled: true,
            url: process.env.INFLUXDB_URL_DEV,
            token: process.env.INFLUXDB_TOKEN_DEV,
            bucket: process.env.INFLUXDB_BUCKET_DEV,
          },
  },
};
