const config = require("./config");
const MongoClient = require("mongodb").MongoClient;
const express = require("express");
const app = express();

MongoClient.connect(config.DB, { useUnifiedTopology: true })
  .then((client) => {
    console.log("Connected to database");
    const db = client.db(`phase${config.PHASE}`);

    app.listen(config.PORT, () => {
      console.log(`Updater service listening at port ${config.PORT}`);
    });
  })
  .catch(console.error);
