import Head from "next/head";
import React from "react";
import FullPageSpinner from "../components/common/FullPageSpinner";
import RedirectToSignIn from "../components/common/redirects/ToSignIn";
import IndexPageComponent from "../components/pages/index";
import useLoadingSession from "../hooks/useLoadingSession";

const IndexPage = () => {
  const [session, loadingSession] = useLoadingSession();

  return (
    <>
      <Head>
        <title>Centrála | beautofuel</title>
      </Head>
      <FullPageSpinner spinning={loadingSession}>
        {session ? (
          <IndexPageComponent session={session} />
        ) : (
          <RedirectToSignIn />
        )}
      </FullPageSpinner>
    </>
  );
};

export default IndexPage;
