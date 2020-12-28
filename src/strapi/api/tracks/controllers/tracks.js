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
    const data = ctx.request.body;
    const entity = await strapi.services.tracks.create(data);

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
        },
      },
    });

    return sanitizeEntity(entity, { model: strapi.models.tracks });
  },
};
