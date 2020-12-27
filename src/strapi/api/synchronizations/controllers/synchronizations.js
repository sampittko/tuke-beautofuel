"use strict";

/**
 * Read the documentation (https://strapi.io/documentation/v3.x/concepts/controllers.html#core-controllers)
 * to customize this controller
 */

const { sanitizeEntity } = require("strapi-utils");
const axios = require("axios");
const { SYNCHRONIZATION_STATUSES } = require("../../../utils/constants");

module.exports = {
  /**
   * Create a record.
   *
   * @return {Object}
   */

  async create(ctx) {
    const enviroCarToken = ctx.request.header["x-token"];

    if (!enviroCarToken) {
      return ctx.badRequest("Request header token field is not set correctly");
    }

    const updaterUrl =
      process.env.NODE_ENV === "production"
        ? process.env.UPDATER_URL
        : process.env.UPDATER_URL_DEV;

    const entity = await strapi.services.synchronizations.create({
      status: SYNCHRONIZATION_STATUSES.pending,
      user: ctx.state.user.id,
    });

    axios
      .get(`${updaterUrl}/newTracks`, {
        headers: {
          "X-User": ctx.state.user.envirocar,
          "X-Token": ctx.request.header["x-token"],
        },
      })
      .then(async (res) => {
        const newTracks = res.data.tracks;

        for (const newTrack of newTracks) {
          await strapi.controllers.tracks.create(ctx.state.user, entity);
        }

        strapi.query("synchronizations").update(
          { id: entity.id },
          {
            status: SYNCHRONIZATION_STATUSES.success,
          }
        );
      })
      .catch(() => {
        strapi.query("synchronizations").update(
          { id: entity.id },
          {
            status: SYNCHRONIZATION_STATUSES.failure,
          }
        );
      });

    return sanitizeEntity(entity, { model: strapi.models.synchronizations });
  },
};
