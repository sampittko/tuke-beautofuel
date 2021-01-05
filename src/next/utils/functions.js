import moment from "moment";

export const getApiUrl = (serverSide) => {
  if (serverSide) {
    return process.env.NODE_ENV === "production"
      ? process.env.API_URL
      : process.env.API_URL_DEV;
  }

  return process.env.NODE_ENV === "production"
    ? process.env.NEXT_PUBLIC_API_URL
    : process.env.NEXT_PUBLIC_API_URL_DEV;
};

const pad = (num) => {
  return ("0" + num).slice(-2);
};

export const formatDuration = (secs) => {
  var minutes = Math.floor(secs / 60);
  secs = secs % 60;
  var hours = Math.floor(minutes / 60);
  minutes = minutes % 60;
  return `${pad(hours)}:${pad(minutes)}:${pad(secs)}`;
  // return pad(hours)+":"+pad(minutes)+":"+pad(secs); for old browsers
};

export const formatDistance = (distance) =>
  `${distance.toFixed(2).replace(".", ",")} km`;
