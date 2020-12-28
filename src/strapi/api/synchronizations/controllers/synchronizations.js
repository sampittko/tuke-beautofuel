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
      return ctx.badRequest("Request header token field is not set");
    }

    if (!ctx.state.user.envirocar) {
      return ctx.badRequest("ID from enviroCar is not set for the user");
    }

    const user = ctx.state.user.id;

    const pendingSynchronization = await strapi
      .query("synchronizations")
      .findOne({
        user,
        status: SYNCHRONIZATION_STATUSES.pending,
      });

    if (pendingSynchronization) {
      return ctx.badRequest("Synchronization is already in progress");
    }

    const entity = await strapi.services.synchronizations.create({
      user,
    });

    const { number: phaseNumber } = await strapi.query("phase").findOne();

    const updaterUrl =
      process.env.NODE_ENV === "production"
        ? process.env.UPDATER_URL
        : process.env.UPDATER_URL_DEV;

    axios
      .post(
        `${updaterUrl}/newTracks`,
        JSON.stringify({
          synchronization: entity.id,
          user,
          phaseNumber,
        }),
        {
          headers: {
            "X-User": ctx.state.user.envirocar,
            "X-Token": ctx.request.header["x-token"],
          },
        }
      )
      .then(({ data }) => {
        strapi.query("synchronizations").update(
          { id: entity.id },
          {
            statusCode: data.statusCode,
            message: data.message,
            status: SYNCHRONIZATION_STATUSES.success,
          }
        );
      })
      .catch((error) => {
        strapi.query("synchronizations").update(
          { id: entity.id },
          {
            statusCode: error.statusCode,
            message: error.message,
            status: SYNCHRONIZATION_STATUSES.failure,
          }
        );
      });

    return sanitizeEntity(entity, { model: strapi.models.synchronizations });
  },
};
