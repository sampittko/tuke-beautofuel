import { getSession } from "next-auth/client";
import Head from "next/head";
import React from "react";
import Redirects from "../components/common/Redirects";
import PageComponent from "../components/pages/index";

const IndexPage = ({ session }) => (
  <>
    <Head>
      <title>Centrála | beautofuel</title>
    </Head>
    {(session && <PageComponent session={session} />) || (
      <Redirects toSignIn replace />
    )}
  </>
);

export const getServerSideProps = async ({ req }) => {
  const session = await getSession({ req });

  return {
    props: {
      session,
    },
  };
};

export default IndexPage;
