import React from "react";
import { signIn, signOut, useSession } from "next-auth/client";
import Link from "next/link";

const IndexPageComponent = () => {
  const [session] = useSession();

  const SignInButton = () => (
    <Link href="/api/auth/signin">
      <button
        onClick={(e) => {
          e.preventDefault();
          signIn();
        }}
      >
        Create an account
      </button>
    </Link>
  );

  const SignOutButton = () => (
    <Link href="/api/auth/signout">
      <button
        onClick={(e) => {
          e.preventDefault();
          signOut();
        }}
      >
        Sign Out
      </button>
    </Link>
  );

  return <div>{!session ? <SignInButton /> : <SignOutButton />}</div>;
};

export default IndexPageComponent;
