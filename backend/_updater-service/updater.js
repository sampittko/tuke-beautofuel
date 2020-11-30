const config = require("./config");
const mongodb = require("mongodb");
const express = require("express");
const bodyParser = require("body-parser");

const ENVIROCAR_TEST_USER = {
  username: "samko",
  mail: "sampittko@gmail.com",
  token: "someamazingtotallyrandomtoken",
};

const { MongoClient } = mongodb;
const updater = express();
updater.use(bodyParser.json());

MongoClient.connect(config.DB, { useUnifiedTopology: true })
  .then((client) => {
    console.log("Connected to database");

    const db = client.db(`phase${config.PHASE}`);
    const syncs_coll = db.collection("syncs");

    updater.post("/api/sync", (req, res) => {
      const username = req.headers["x-user"];
      const token = req.headers["x-token"];

      if (
        username !== ENVIROCAR_TEST_USER.username ||
        token !== ENVIROCAR_TEST_USER.token
      ) {
        res.send("Specified does not exist");
        return;
      }

      syncs_coll.find({ username, endTimestamp: null }).toArray((err, data) => {
        if (err) console.error;

        if (data.length > 0) {
          res.send("Sync is already in progress");
          return;
        }

        syncs_coll.insertOne({
          username,
          startTimestamp: new Date().getTime(),
          endTimestamp: null,
          status: null,
        });

        res.send("Sync has started successfully");
      });
    });

    updater.get("/api/status", (req, res) => {});

    updater.listen(config.PORT, () => {
      console.log(`Updater service listening at port ${config.PORT}`);
    });
  })
  .catch(console.error);
