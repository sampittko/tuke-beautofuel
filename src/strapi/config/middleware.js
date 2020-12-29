module.exports = {
  settings: {
    cors: {
      enabled: true,
      origin: [
        "http://localhost:3000",
        "http://beautofuel.vps.wbsprt.com:3000",
        "http://localhost:1337",
        "http://beautofuel.vps.wbsprt.com:1337",
      ],
      headers: ["Content-Type", "Authorization", "X-Frame-Options", "X-Token"],
    },
  },
};
