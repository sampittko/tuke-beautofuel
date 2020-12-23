import { getSession } from "next-auth/client";
import Head from "next/head";
import React from "react";
import PageComponent from "../../components/pages/public/hall-of-fame";

const PublicHallOfFamePage = ({ session }) => (
  <>
    <Head>
      <title>Sieň slávy | beautofuel</title>
    </Head>
    <PageComponent session={session} />
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

export default PublicHallOfFamePage;
