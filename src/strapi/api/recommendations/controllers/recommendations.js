"use strict";

/**
 * Read the documentation (https://strapi.io/documentation/v3.x/concepts/controllers.html#core-controllers)
 * to customize this controller
 */

const { sanitizeEntity } = require("strapi-utils");

module.exports = {
  /**
   * Retrieve a record.
   *
   * @return {Object}
   */

  async findOne(ctx) {
    const { number: phaseNumber } = await strapi.query("phase").findOne();

    if (phaseNumber === 1) {
      return {
        text: "",
      };
    }

    const { id } = ctx.params;

    if (id !== "random") {
      return ctx.badRequest("Query parameter is invalid");
    }

    const recommendations = await strapi.query("recommendations").find();

    const entity =
      recommendations[Math.floor(Math.random() * recommendations.length)];

    return sanitizeEntity(entity, { model: strapi.models.recommendations });
  },
};
