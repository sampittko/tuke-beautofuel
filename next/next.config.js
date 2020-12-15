module.exports = {
  env: {
    CMS_BASEURL: "http://localhost:1337",
  },
  webpackDevMiddleware: (config) => {
    config.watchOptions = {
      poll: 1000,
      aggregateTimeout: 300,
    };

    return config;
  },
};
