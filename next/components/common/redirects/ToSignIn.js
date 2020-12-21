import { useRouter } from "next/router";
import { useEffect } from "react";

const RedirectToSignIn = () => {
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== undefined) {
      router.push("/auth/signin");
    }
  }, [router]);

  return null;
};

export default RedirectToSignIn;
