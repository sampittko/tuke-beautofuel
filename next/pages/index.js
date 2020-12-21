import Head from "next/head";
import React from "react";
import Page from "../components/pages/index";

const IndexPage = ({ session }) => (
  <>
    <Head>
      <title>Centrála | beautofuel</title>
    </Head>
    <Page session={session} />
  </>
);

export default IndexPage;
