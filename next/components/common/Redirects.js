import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const PATHS = {
  toDashboard: "/",
  toSignIn: "/auth/signin",
  default: "/",
};

const Redirects = ({ toSignIn, toDashboard, replace }) => {
  const getRedirectPath = () => {
    if (toDashboard) {
      return PATHS.toDashboard;
    } else if (toSignIn) {
      return PATHS.toSignIn;
    } else {
      return PATHS.default;
    }
  };

  const router = useRouter();
  const [redirectPath] = useState(getRedirectPath());

  useEffect(() => {
    if (typeof window !== undefined) {
      if (replace) {
        router.replace(redirectPath);
      } else {
        router.push(redirectPath);
      }
    }
  }, [router]);

  return null;
};

export default Redirects;
