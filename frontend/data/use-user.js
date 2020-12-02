import useSWR from "swr";

import userFetcher from "../libs/api-user";

const useUser = (identifier, password) => {
  const token = useToken();

  const { data, mutate, error } = useSWR("api-user", () =>
    userFetcher(identifier, password)
  );

  const loading = !data && !error;
  const loggedOut = error && error.status === 403;

  return {
    loading,
    loggedOut,
    user: data,
    mutate,
  };
};

export default useUser;
