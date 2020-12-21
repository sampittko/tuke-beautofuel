import { useRouter } from "next/router";
import { useEffect } from "react";

const RedirectToDashboard = () => {
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== undefined) {
      router.push("/");
    }
  }, [router]);

  return null;
};

export default RedirectToDashboard;
