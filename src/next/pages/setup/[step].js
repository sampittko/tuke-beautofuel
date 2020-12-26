import React, { useState } from "react";
import { useRouter } from "next/router";
import PageComponent from "../../components/pages/setup/step";
import { getSession } from "next-auth/client";
import Redirects from "../../components/common/Redirects";
import WithGraphQL from "../../lib/with-graphql";

const TOTAL_SETUP_STEPS_COUNT = 4;

const SetupStepPage = ({ session }) => {
  const router = useRouter();
  const [step] = useState(parseInt(router.query.step));

  const isSetupStepValid = () => {
    if (step) {
      return step >= 1 && step <= TOTAL_SETUP_STEPS_COUNT;
    }
    return false;
  };

  return (
    <WithGraphQL session={session}>
      {(isSetupStepValid() && session && (
        <PageComponent activeStep={step} />
      )) || <Redirects toDashboard replace />}
    </WithGraphQL>
  );
};

export const getServerSideProps = async ({ req }) => {
  const session = await getSession({ req });

  return {
    props: {
      session,
    },
  };
};

export default SetupStepPage;