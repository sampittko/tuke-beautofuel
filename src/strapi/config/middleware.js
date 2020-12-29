module.exports = {
  settings: {
    cors: {
      enabled: true,
      origin:
        process.env.ON_VPS === 1
          ? [
              process.env.CORS_ORIGIN_NEXT,
              process.env.CORS_ORIGIN_STRAPI,
              process.env.CORS_ORIGIN_DOCKER_UPDATER,
            ]
          : [
              process.env.CORS_ORIGIN_NEXT,
              process.env.CORS_ORIGIN_NEXT_DEV,
              process.env.CORS_ORIGIN_STRAPI,
              process.env.CORS_ORIGIN_STRAPI_DEV,
              process.env.CORS_ORIGIN_UPDATER,
              process.env.CORS_ORIGIN_UPDATER_DEV,
              process.env.CORS_ORIGIN_DOCKER_UPDATER,
            ],
      headers: ["Content-Type", "Authorization", "X-Frame-Options", "X-Token"],
    },
  },
};
