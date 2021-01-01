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

    let substractedCredits2 = 0;
    let substractedCredits3 = 0;
    let addedCredits2 = 0;
    let addedCredits3 = 0;

    const { number: phaseNumber } = await strapi.query("phase").findOne();

    if (phaseNumber === 2) {
      substractedCredits2 =
        data.type === TRANSACTION_TYPES.substraction ? -data.value : 0;
      addedCredits2 = data.type === TRANSACTION_TYPES.addition ? data.value : 0;
    } else if (phaseNumber === 3) {
      substractedCredits3 =
        data.type === TRANSACTION_TYPES.substraction ? -data.value : 0;
      addedCredits3 = data.type === TRANSACTION_TYPES.addition ? data.value : 0;
    }

    await strapi.query("wallets").update(
      { id: data.wallet },
      {
        credits2: wallet.credits2 + substractedCredits2 + addedCredits2,
        credits3: wallet.credits3 + substractedCredits3 + addedCredits3,
      }
    );

    return sanitizeEntity(entity, { model: strapi.models.transactions });
  },
};
