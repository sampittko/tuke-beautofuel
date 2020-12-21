import React from "react";
import Head from "next/head";
import Page from "../components/pages/error";

const NotFound = () => {
  return (
    <>
      <Head>
        <title>Error Page</title>
      </Head>
      <Page statusCode={404} />
    </>
  );
};

export default NotFound;
