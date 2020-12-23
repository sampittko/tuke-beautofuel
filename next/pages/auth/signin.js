import React from "react";
import { getSession, providers } from "next-auth/client";
import Head from "next/head";
import PageComponent from "../../components/pages/auth/signin";
import Redirects from "../../components/common/Redirects";

const SignInPage = ({ providers, session }) => (
  <>
    <Head>
      <title>Prihlásenie | beautofuel</title>
    </Head>
    {(!session && (
      <PageComponent providers={providers} session={session} />
    )) || <Redirects toDashboard replace />}
  </>
);

export const getServerSideProps = async (context) => {
  const session = await getSession({ req: context.req });

  return {
    props: {
      session,
      providers: await providers(context),
    },
  };
};

export default SignInPage;
