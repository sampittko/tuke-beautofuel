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
    const entity = await strapi.services.transactions.create(data);

    const wallet = await strapi.query("wallets").findOne({
      id: data.wallet,
    });

    const substractedCredits =
      data.type === TRANSACTION_TYPES.substraction ? -data.value : 0;
    const addedCredits =
      data.type === TRANSACTION_TYPES.addition ? data.value : 0;

    await strapi.query("wallets").update(
      { id: data.wallet },
      {
        credits: wallet.credits + substractedCredits + addedCredits,
      }
    );

    return sanitizeEntity(entity, { model: strapi.models.transactions });
  },
};
