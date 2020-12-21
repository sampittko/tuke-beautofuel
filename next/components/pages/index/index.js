import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/client";
import Dashboard from "./dashboard";
import Unauthenticated from "../../common/unauthenticated";

const IndexPageComponent = () => {
  const [session] = useSession();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  return session ? <Dashboard /> : loading ? null : <Unauthenticated />;
};

export default IndexPageComponent;
