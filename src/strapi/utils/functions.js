exports.getUpdaterUrl = () =>
  process.env.NODE_ENV === "production"
    ? process.env.UPDATER_URL
    : process.env.UPDATER_URL_DEV;
