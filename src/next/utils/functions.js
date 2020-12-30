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
