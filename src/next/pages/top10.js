import { getSession } from "next-auth/client";
import Head from "next/head";
import React from "react";
import PageComponent from "../components/pages/top10";
import WithGraphQL from "../lib/with-graphql";

const Top10Page = ({ session }) => (
  <WithGraphQL session={session}>
    <Head>
      <title>Top 10 ekologických šoférov | beautofuel</title>
    </Head>
    <PageComponent />
  </WithGraphQL>
);

export const getServerSideProps = async ({ req }) => {
  const session = await getSession({ req });

  return {
    props: {
      session,
    },
  };
};

export default Top10Page;
