import { Router } from "next/router";
import { useEffect } from "react";

const useProtectedRouteRedirect = (loading, user) => {
  useEffect(() => {
    if (!loading && !user) {
      Router.replace("/app/auth");
    }
  }, [user]);

  return null;
};

export default useProtectedRouteRedirect;
