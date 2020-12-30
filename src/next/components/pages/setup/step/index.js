import React, { useState } from "react";
import Stepper from "./stepper";
import One from "./One";
import Two from "./Two";
import Three from "./Three";
import Navigation from "../../../common/Navigation";
import Success from "./Success";
import { useMutation } from "@apollo/client";
import UsersAPI from "../../../../lib/api/users";
import { useSession } from "next-auth/client";

const SetupStepPageComponent = ({
  activeStep,
  onStepChange: handleNextStep,
}) => {
  const [session] = useSession();

  const [username, setUsername] = useState("");
  const [envirocar, setEnvirocar] = useState("");
  const [finished, setFinished] = useState(false);

  const [
    setupUpdate,
    {
      data: setupUpdateData,
      error: setupUpdateError,
      loading: setupUpdateLoading,
    },
  ] = useMutation(UsersAPI.setupUpdate, {
    variables: {
      userId: session.id,
      username,
      envirocar,
    },
  });

  const [
    setupCompleted,
    {
      data: setupFinishedData,
      error: setupFinishedError,
      loading: setupFinishedLoading,
    },
  ] = useMutation(UsersAPI.setupCompleted, {
    variables: {
      userId: session.id,
    },
  });

  const handleThreeSuccess = () => {
    setFinished(true);
    handleNextStep();
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <Navigation />
      <div className="bg-green-800 pb-32">
        <header className="py-10"></header>
      </div>

      <main className="-mt-32">
        <div className="max-w-7xl mx-auto pb-12 px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow py-6">
            <Stepper activeStep={activeStep} finished={finished} />
            {activeStep === 1 && (
              <One
                username={username}
                onUsernameChange={(newUsername) => setUsername(newUsername)}
                onSubmit={handleNextStep}
              />
            )}
            {activeStep === 2 && (
              <Two
                envirocar={envirocar}
                onEnvirocarChange={(newEnvirocar) => setEnvirocar(newEnvirocar)}
                onSubmit={() => setupUpdate()}
                onSuccess={handleNextStep}
                data={setupUpdateData}
                loading={setupUpdateLoading}
                error={setupUpdateError}
              />
            )}
            {activeStep === 3 && !finished && (
              <Three
                onSubmit={() => setupCompleted()}
                onSuccess={() => handleThreeSuccess()}
                loading={setupFinishedLoading}
                error={setupFinishedError}
                data={setupFinishedData}
              />
            )}
            {activeStep === 3 && finished && <Success />}
          </div>
        </div>
      </main>
    </div>
  );
};

export default SetupStepPageComponent;
