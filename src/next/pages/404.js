import React from "react";
import Head from "next/head";
import Page from "../components/pages/error";

const NotFoundPage = () => (
  <>
    <Head>
      <title>Nenájdené | beautofuel</title>
    </Head>
    <Page statusCode={404} />
  </>
);

export default NotFoundPage;
