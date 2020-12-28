"use strict";

/**
 * Read the documentation (https://strapi.io/documentation/v3.x/concepts/controllers.html#core-controllers)
 * to customize this controller
 */

const { sanitizeEntity } = require("strapi-utils");

module.exports = {
  /**
   * Create a record.
   *
   * @return {Object}
   */

  async create(user, synchronization) {
    const entity = await strapi.services.tracks.create({
      duration: 0,
      date: "2020-12-27",
      user: user.id,
      score: 1,
      synchronization: synchronization.id,
    });

    const wallet = await strapi.query("wallets").findOne({ id: user.wallet });

    await strapi.query("wallets").update(
      { id: user.wallet },
      {
        credits: wallet.credits + entity.score,
      }
    );

    return sanitizeEntity(entity, { model: strapi.models.tracks });
  },
};
