import { EXPERIMENT_OVERVIEW_LINKS, USER_GROUPS } from "./constants";

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

export const formatNumber = (number) => number.toFixed(2).replace(".", ",");

// DO NOT DO THIS FOR SECURITY REASONS
// BUT I CAN SINCE THIS IS MY DIPLOMA THESIS
export const getExperimentOverviewLink = (userGroup, phaseNumber) => {
  switch (phaseNumber) {
    case 1:
      return EXPERIMENT_OVERVIEW_LINKS.phase1;
    case 2:
      if (userGroup === USER_GROUPS.gamification) {
        return EXPERIMENT_OVERVIEW_LINKS["phase2-gamification"];
      } else if (userGroup === USER_GROUPS.rewards) {
        return EXPERIMENT_OVERVIEW_LINKS["phase2-rewards"];
      }
      throw new Error("Incorrect user group");
    case 3:
      return EXPERIMENT_OVERVIEW_LINKS.phase3;
    default:
      return "#";
  }
};
