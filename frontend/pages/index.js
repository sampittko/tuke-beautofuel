import React from "react";
import Link from "next/link";
import useUser from "../data/use-user";
import usePublicRouteRedirect from "../hooks/use-public-route-redirect";

const IndexPage = () => {
  const { user, loading } = useUser();

  usePublicRouteRedirect({ loading, user });

  return (
    <div>
      <Link href="/app/auth">Login</Link>
    </div>
  );
};

export default IndexPage;
