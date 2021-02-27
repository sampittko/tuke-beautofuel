"use strict";

/**
 * Read the documentation (https://strapi.io/documentation/v3.x/concepts/controllers.html#core-controllers)
 * to customize this controller
 */

const { sanitizeEntity } = require("strapi-utils");
const {
  TRANSACTION_TYPES,
  PRODUCT_NAMES,
  USER_GROUPS,
} = require("../../../utils/constants");
const _ = require("lodash");
const { formatDuration } = require("../../../utils/functions");

module.exports = {
  /**
   * Count records.
   *
   * @return {Number}
   */

  count(ctx) {
    if (ctx.state.user.username !== "updater") {
      return ctx.badRequest("You are not allowed to perform this action");
    }

    if (ctx.query._q) {
      return strapi.services.tracks.countSearch(ctx.query);
    }
    return strapi.services.tracks.count(ctx.query);
  },

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
      const product = await strapi.query("products").findOne({
        name: PRODUCT_NAMES.krovka,
      });

      if (
        phaseNumber === 3 ||
        (phaseNumber === 2 && data.userGroup === USER_GROUPS.rewards)
      ) {
        await strapi.query("purchases").create({
          track: entity.id,
          product: product.id,
          user: data.user,
          quantity:
            data.score <= 0 ? 0 : Math.floor(data.score / product.price),
          unitPrice: product.price,
          phaseNumber,
        });
      }

      const wallet = await strapi.query("wallets").findOne({
        user: data.user,
      });

      if (data.score > 0) {
        await strapi.controllers.transactions.create({
          request: {
            body: {
              type: TRANSACTION_TYPES.addition,
              value: Math.abs(data.score),
              synchronization: data.synchronization,
              wallet: wallet.id,
              phaseNumber,
            },
          },
        });
      }
    }

    return sanitizeEntity(entity, { model: strapi.models.tracks });
  },

  async top10(ctx) {
    const { number: phaseNumber } = await strapi.query("phase").findOne();

    if (phaseNumber === 1) {
      return ctx.badRequest("There is no top 10 table during the first phase");
    }

    const tracks = await strapi.query("tracks").find({
      phaseNumber,
    });

    if (tracks.length === 0) {
      return { drivers: [] };
    }

    let users;
    if (phaseNumber === 2) {
      users = await strapi.query("user", "users-permissions").find({
        group: USER_GROUPS.gamification,
      });
    } else {
      const gamificationUsers = await strapi
        .query("user", "users-permissions")
        .find({
          group: USER_GROUPS.gamification,
        });

      const rewardsUsers = await strapi
        .query("user", "users-permissions")
        .find({
          group: USER_GROUPS.rewards,
        });

      users = [...gamificationUsers, ...rewardsUsers];
    }

    let wallets = await strapi.query("wallets").find();
    wallets = _.groupBy(wallets, "user.username");

    const driversTracks = _.chain(tracks)
      .groupBy("user.username")
      .map((track, key, tracks) => {
        const averageScore = Math.floor(
          wallets[key][0][`score${phaseNumber}`] / tracks[key].length
        );

        return {
          username: key,
          id: track[0].user.id,
          score: averageScore,
          group: track[0].user.group,
        };
      })
      .keyBy("username")
      .value();

    users.forEach((user) => {
      if (!driversTracks[`${user.username}`]) {
        driversTracks[`${user.username}`] = {
          id: user.id,
          username: user.username,
          score: 0,
          group: user.group,
        };
      }
    });

    let drivers = [];

    _.forOwn(driversTracks, (value) => {
      if (phaseNumber === 3 || value.group === USER_GROUPS.gamification) {
        drivers.push({
          username: value.username,
          score: value.score,
        });
      }
    });

    drivers = _.chain(drivers)
      .orderBy(["score", "username"], ["desc", "asc"])
      .dropRight(drivers.length > 10 ? drivers.length - 10 : 0)
      .value();

    return {
      drivers,
    };
  },

  async top10Stats(ctx) {
    const { number: phaseNumber } = await strapi.query("phase").findOne();

    if (phaseNumber === 1) {
      return ctx.badRequest("There is no top 10 table during the first phase");
    }

    let tracks;
    if (phaseNumber === 2) {
      tracks = await strapi.query("tracks").find({
        phaseNumber,
        ["user.group"]: USER_GROUPS.gamification,
      });
    } else {
      tracks = await strapi.query("tracks").find({
        phaseNumber,
      });
    }

    if (tracks.length === 0) {
      return {
        score: 0,
        duration: "00:00:00",
        distance: 0,
        fuelConsumed: 0,
      };
    }

    const score = Math.floor(_.meanBy(tracks, "score"));
    const duration = _.sumBy(tracks, "duration");
    const distance = _.sumBy(tracks, "totalDistance");
    const fuelConsumed = _.sumBy(tracks, "fuelConsumed");

    return {
      score,
      duration: formatDuration(duration),
      distance: distance.toFixed(2),
      fuelConsumed: fuelConsumed.toFixed(2),
    };
  },

  async top10Position(ctx) {
    const { number: phaseNumber } = await strapi.query("phase").findOne();

    if (phaseNumber === 1) {
      return ctx.badRequest("There is no top 10 table during the first phase");
    }

    if (
      phaseNumber === 2 &&
      ctx.state.user.group !== USER_GROUPS.gamification
    ) {
      return ctx.badRequest("User is not part of the gamification group");
    }

    const username = ctx.state.user.username;

    const { drivers: top10Drivers } = await strapi.controllers.tracks.top10(
      ctx
    );

    let positionIndex = top10Drivers.findIndex(
      (driver) => driver.username === username
    );

    if (positionIndex === -1) {
      positionIndex = 10;
    }

    return {
      position: positionIndex + 1,
    };
  },
};
