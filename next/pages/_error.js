import React from "react";
import Head from "next/head";
import PageComponent from "../components/pages/error";

const Error = ({ statusCode }) => (
  <>
    <Head>
      <title>Chyba {statusCode} | beautofuel</title>
    </Head>
    <PageComponent statusCode={statusCode} />
  </>
);

Error.getInitialProps = ({ res, err }) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;

  return { statusCode };
};

export default Error;
