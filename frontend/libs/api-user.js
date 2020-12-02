import axios from "axios";

const apiUser = async (identifier, password) => {
  if (!identifier || !password) {
    throwNotAuthorizedError();
  }

  let jwt, user;

  await axios
    .post(`${process.env.CMS_BASEURL}/auth/local`, {
      identifier,
      password,
    })
    .then((res) => {
      jwt = res.data.jwt;
      user = res.data.user;
    });

  if (document.cookie.includes(`strapi-jwt=${jwt}`)) {
    return {
      name: user.username,
    };
  }

  throwNotAuthorizedError();
};

const throwNotAuthorizedError = () => {
  const error = new Error("Not authorized!");
  error.status = 403;
  throw error;
};

export default apiUser;
