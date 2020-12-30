"use strict";

const { default: axios } = require("axios");
const { getUpdaterUrl } = require("../../../utils/functions");

module.exports = {
  userCredentialsValid: async (ctx) => {
    const enviroCarToken = ctx.request.header["x-token"];
    const enviroCarUser = ctx.request.header["x-user"];

    if (!enviroCarToken || !enviroCarUser) {
      return ctx.badRequest(
        "Make sure that user and token headers are set correctly"
      );
    }

    const updaterUrl = getUpdaterUrl();

    const res = await axios.get(`${updaterUrl}/userCredentialsValid`, {
      headers: {
        "X-User": ctx.request.header["x-user"],
        "X-Token": ctx.request.header["x-token"],
      },
    });

    if (res.error) {
      return ctx.badRequest("There was a problem with updater");
    }

    if (!res.data.valid) {
      return ctx.badRequest("Invalid enviroCar password");
    }

    return {
      valid: true,
    };
  },
};
