const { Point } = require("@influxdata/influxdb-client");

exports.getUpdaterUrl = () =>
  process.env.NODE_ENV === "production"
    ? process.env.UPDATER_URL
    : process.env.UPDATER_URL_DEV;

exports.buildSynchronizationPoint = ({ id, user, phase, tracks }) =>
  new Point("synchronizations")
    .tag("id", id)
    .tag("user", user)
    .tag("phase", phase)
    .intField("tracks", tracks)
    .timestamp(new Date());

exports.buildPurchasesPoint = ({
  id,
  user,
  phase,
  quantity,
  unitPrice,
  made,
}) =>
  new Point("purchases")
    .tag("id", id)
    .tag("user", user)
    .tag("phase", phase)
    .tag("unitPrice", unitPrice)
    .tag("quantity", quantity)
    .intField("made", made ? 1 : 0)
    .timestamp(new Date());

const pad = (num) => {
  return ("0" + num).slice(-2);
};

exports.formatDuration = (secs) => {
  var minutes = Math.floor(secs / 60);
  secs = secs % 60;
  var hours = Math.floor(minutes / 60);
  minutes = minutes % 60;
  return `${pad(hours)}:${pad(minutes)}:${pad(secs)}`;
};
