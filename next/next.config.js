module.exports = {
  images: {
    domains: ["lh3.googleusercontent.com", "localhost:3001"],
  },
  webpackDevMiddleware: (config) => {
    config.watchOptions = {
      poll: 1000,
      aggregateTimeout: 300,
    };

    return config;
  },
};
