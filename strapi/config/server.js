module.exports = ({ env }) => ({
  host: env("APP_HOST", "0.0.0.0"),
  port: env.int("NODE_PORT", 1337),
  admin: {
    auth: {
      secret: env("ADMIN_JWT_SECRET", "47821ebc04fe484cde01f51474d7bc5e"),
    },
  },
});
