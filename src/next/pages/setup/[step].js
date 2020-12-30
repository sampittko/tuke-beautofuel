import React, { useState } from "react";
import { useRouter } from "next/router";
import PageComponent from "../../components/pages/setup/step";
import { getSession } from "next-auth/client";
import Redirects from "../../components/common/Redirects";
import WithGraphQL from "../../lib/with-graphql";

export const TOTAL_SETUP_STEPS_COUNT = 3;

const SetupStepPage = ({ session }) => {
  const router = useRouter();
  const [step, setStep] = useState(parseInt(router.query.step));
  const [completedSteps, setCompletedSteps] = useState(0);

  const isStepValid = () => {
    if (step) {
      const validNumber = step >= 1 && step <= TOTAL_SETUP_STEPS_COUNT;
      const previousCompleted = step === 1 || completedSteps === step - 1;
      return validNumber && previousCompleted;
    }
    return false;
  };

  const handleNextStep = () => {
    const nextStep = step + 1;
    if (nextStep <= TOTAL_SETUP_STEPS_COUNT) {
      setStep(nextStep);
      setCompletedSteps(completedSteps + 1);
    } else {
      console.log("konecna");
    }
  };

  return (
    <WithGraphQL session={session}>
      {(session && isStepValid() && (
        <PageComponent activeStep={step} onStepChange={handleNextStep} />
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
