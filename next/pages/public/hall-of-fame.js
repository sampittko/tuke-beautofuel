import Head from "next/head";
import React from "react";
import FullPageSpinner from "../../components/common/FullPageSpinner";
import PublicHallOfFamePageComponent from "../../components/pages/public/hall-of-fame";
import useLoadingSession from "../../hooks/useLoadingSession";

const PublicHallOfFamePage = () => {
  const [session, loadingSession] = useLoadingSession();

  return (
    <>
      <Head>
        <title>Sieň slávy | beautofuel</title>
      </Head>
      <FullPageSpinner spinning={loadingSession}>
        <PublicHallOfFamePageComponent session={session} />
      </FullPageSpinner>
    </>
  );
};

export default PublicHallOfFamePage;
