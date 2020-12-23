import { getSession } from "next-auth/client";
import Head from "next/head";
import React from "react";
import PageComponent from "../../components/pages/public/hall-of-fame";
import WithGraphQL from "../../lib/with-graphql";

const PublicHallOfFamePage = ({ session }) => (
  <WithGraphQL session={session}>
    <Head>
      <title>Sieň slávy | beautofuel</title>
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

export default PublicHallOfFamePage;
