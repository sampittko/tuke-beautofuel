import { Router } from "next/router";
import { useEffect } from "react";

const usePublicRouteRedirect = (loading, user) => {
  useEffect(() => {
    if (!loading && user) {
      Router.replace("/app/dashboard");
    }
  }, [user]);

  return null;
};

export default usePublicRouteRedirect;
