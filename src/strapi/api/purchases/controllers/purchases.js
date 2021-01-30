"use strict";

/**
 * Read the documentation (https://strapi.io/documentation/v3.x/concepts/controllers.html#core-controllers)
 * to customize this controller
 */

const { sanitizeEntity } = require("strapi-utils");
const { TRANSACTION_TYPES, USER_GROUPS } = require("../../../utils/constants");
const { buildPurchasesPoint } = require("../../../utils/functions");

module.exports = {
  /**
   * Update a record.
   *
   * @return {Object}
   */

  async update(ctx) {
    const { id } = ctx.params;

    const { number: phaseNumber } = await strapi.query("phase").findOne();

    if (
      phaseNumber === 2 &&
      ctx.state.user.group === USER_GROUPS.gamification
    ) {
      return ctx.badRequest("You dont have rights to perform this action");
    }

    const entity = await strapi.services.purchases.update(
      { id },
      ctx.request.body
    );

    strapi.services.influxdb.writePoint(
      buildPurchasesPoint({
        id,
        user: ctx.state.user.id,
        phase: phaseNumber,
        quantity: entity.quantity,
        unitPrice: entity.unitPrice,
        made: entity.made,
      })
    );
    strapi.services.influxdb.flush();

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
