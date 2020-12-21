import React from "react";
import { providers } from "next-auth/client";
import Head from "next/head";
import Page from "../../components/pages/auth/signin";

const SignInPage = ({ providers }) => (
  <>
    <Head>
      <title>Prihlásenie | beautofuel</title>
    </Head>
    <Page providers={providers} />
  </>
);

SignInPage.getInitialProps = async (context) => {
  return {
    providers: await providers(context),
  };
};

export default SignInPage;
