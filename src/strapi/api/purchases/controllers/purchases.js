"use strict";

/**
 * Read the documentation (https://strapi.io/documentation/v3.x/concepts/controllers.html#core-controllers)
 * to customize this controller
 */

const { sanitizeEntity } = require("strapi-utils");
const { TRANSACTION_TYPES } = require("../../../utils/constants");

module.exports = {
  /**
   * Update a record.
   *
   * @return {Object}
   */

  async update(ctx) {
    const { id } = ctx.params;

    const entity = await strapi.services.purchases.update(
      { id },
      ctx.request.body
    );

    const { number: phaseNumber } = await strapi.query("phase").findOne();

    const wallet = await strapi.query("wallets").findOne({
      user: ctx.state.user.id,
    });

    await strapi.controllers.transactions.create({
      request: {
        body: {
          type: ctx.request.body.made
            ? TRANSACTION_TYPES.substraction
            : TRANSACTION_TYPES.addition,
          value: Math.abs(entity.quantity * entity.unitPrice),
          purchase: entity.id,
          wallet: wallet.id,
          phaseNumber,
        },
      },
    });

    return sanitizeEntity(entity, { model: strapi.models.purchases });
  },
};
