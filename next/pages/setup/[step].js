import React from "react";
import { useRouter } from "next/router";
import RedirectToDashboard from "../../components/common/redirects/ToDashboard";
import useLoadingSession from "../../hooks/useLoadingSession";
import StepThree from "../../components/pages/setup/step/Three";
import StepTwo from "../../components/pages/setup/step/Two";
import StepOne from "../../components/pages/setup/step/One";
import StepFour from "../../components/pages/setup/step/Four";
import FullPageSpinner from "../../components/common/FullPageSpinner";
import Stepper from "../../components/pages/setup/Stepper";

const validSteps = ["1", "2", "3", "4"];
const stepComponents = [<StepOne />, <StepTwo />, <StepThree />, <StepFour />];

const SetupStepPage = () => {
  const router = useRouter();
  const [session, loadingSession] = useLoadingSession();
  const { step } = router.query;

  const isValidStep = () => {
    return validSteps.includes(step);
  };

  return (
    <FullPageSpinner spinning={!step || loadingSession}>
      {!isValidStep() || !session ? (
        <RedirectToDashboard />
      ) : (
        <>
          <Stepper activeStep={Number(step)} />
          {stepComponents[validSteps.findIndex((elm) => elm === step)]}
        </>
      )}
    </FullPageSpinner>
  );
};

export default SetupStepPage;
