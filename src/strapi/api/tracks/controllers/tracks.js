"use strict";

/**
 * Read the documentation (https://strapi.io/documentation/v3.x/concepts/controllers.html#core-controllers)
 * to customize this controller
 */

const { sanitizeEntity } = require("strapi-utils");
const { TRANSACTION_TYPES } = require("../../../utils/constants");

module.exports = {
  /**
   * Create a record.
   *
   * @return {Object}
   */

  async create(ctx) {
    if (ctx.state.user.username !== "updater") {
      return ctx.badRequest("You are not allowed to perform this action");
    }

    const data = ctx.request.body;

    const synchronization = await strapi.query("synchronizations").findOne({
      id: data.synchronization,
    });

    if (!synchronization) {
      return ctx.badRequest("Synchronization does not exist");
    }

    const entity = await strapi.services.tracks.create(data);

    const { number: phaseNumber } = await strapi.query("phase").findOne();

    if (phaseNumber !== 1) {
      const wallet = await strapi.query("wallets").findOne({
        user: data.user,
      });

      await strapi.controllers.transactions.create({
        request: {
          body: {
            type:
              data.score > 0
                ? TRANSACTION_TYPES.addition
                : TRANSACTION_TYPES.substraction,
            value: Math.abs(data.score),
            synchronization: data.synchronization,
            wallet: wallet.id,
            phaseNumber,
          },
        },
      });
    }

    return sanitizeEntity(entity, { model: strapi.models.tracks });
  },
};
