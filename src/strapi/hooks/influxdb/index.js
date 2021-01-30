const { InfluxDB } = require("@influxdata/influxdb-client");

module.exports = (strapi) => {
  return {
    async initialize() {
      const { url, token, bucket } = strapi.config.get(
        "hook.settings.influxdb"
      );

      strapi.services.influxdb = new InfluxDB({ url, token }).getWriteApi(
        "",
        bucket,
        "ns"
      );
    },
  };
};
