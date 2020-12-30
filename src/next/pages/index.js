import { getSession } from "next-auth/client";
import Head from "next/head";
import React from "react";
import Redirects from "../components/common/Redirects";
import PageComponent from "../components/pages/index";
import WithGraphQL from "../lib/with-graphql";
import axios from "axios";
import { getApiUrl } from "../utils/functions";

const IndexPage = ({ session, setupCompleted }) => {
  if (session && !setupCompleted) {
    return <Redirects toSetup step={1} />;
  }

  return (
    <WithGraphQL session={session}>
      <Head>
        <title>Centrála | beautofuel</title>
      </Head>
      {(session && <PageComponent />) || <Redirects toSignIn replace />}
    </WithGraphQL>
  );
};

export const getServerSideProps = async ({ req }) => {
  let session = await getSession({ req });
  let setupCompleted = true;

  if (session) {
    try {
      const res = await axios.get(`${getApiUrl(true)}/users/me`, {
        headers: {
          authorization: `Bearer ${session.jwt}`,
        },
      });
      setupCompleted = res.data.setupCompleted;
    } catch (error) {
      setupCompleted = false;
      session = null;
    }
  }

  return {
    props: {
      session,
      setupCompleted,
    },
  };
};

export default IndexPage;
