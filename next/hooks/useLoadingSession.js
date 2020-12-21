import { useSession } from "next-auth/client";
import { useEffect, useState } from "react";

const useLoadingSession = (timeoutMillis = 500) => {
  const [session] = useSession();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, timeoutMillis);
  }, []);

  return [session, loading];
};

export default useLoadingSession;
