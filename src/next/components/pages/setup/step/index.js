import React, { useState } from "react";
import Stepper from "./stepper";
import One from "./One";
import Two from "./Two";
import Three from "./Three";
import Navigation from "../../../common/Navigation";
import Success from "./Success";
import { useMutation, useQuery } from "@apollo/client";
import UsersAPI from "../../../../lib/api/users";
import { useSession } from "next-auth/client";
import Spinner from "../../../common/Spinner";
import Redirects from "../../../common/Redirects";

const SetupStepPageComponent = ({
  activeStep,
  onStepChange: handleNextStep,
}) => {
  const [session] = useSession();

  const [username, setUsername] = useState("");
  const [envirocar, setEnvirocar] = useState("");
  const [completed, setCompleted] = useState(false);

  const { data: userData, loading: userLoading, error: userError } = useQuery(
    UsersAPI.setupCompleted,
    {
      variables: { userId: session.id },
    }
  );

  const [
    setupUpdate,
    {
      data: setupUpdateData,
      error: setupUpdateError,
      loading: setupUpdateLoading,
    },
  ] = useMutation(UsersAPI.updateUsernameAndEnvirocar, {
    variables: {
      userId: session.id,
      username,
      envirocar,
    },
  });

  const [
    setupCompleted,
    {
      data: setupCompletedData,
      error: setupCompletedError,
      loading: setupCompletedLoading,
    },
  ] = useMutation(UsersAPI.completeSetup, {
    variables: {
      userId: session.id,
    },
  });

  const handleThreeSuccess = () => {
    setCompleted(true);
    handleNextStep();
  };

  return (
    <Spinner dependencies={[userLoading]} errors={[userError]}>
      {!userData?.user.setupCompleted ? (
        <div className="min-h-screen bg-gray-50">
          <Navigation />
          <div className="pb-32 bg-green-800">
            <header className="py-10"></header>
          </div>

          <main className="-mt-32">
            <div className="px-4 pb-12 mx-auto max-w-7xl sm:px-6 lg:px-8">
              <div className="py-6 bg-white rounded-lg shadow">
                <Stepper activeStep={activeStep} completed={completed} />
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
                    onEnvirocarChange={(newEnvirocar) =>
                      setEnvirocar(newEnvirocar)
                    }
                    onSubmit={() => setupUpdate()}
                    onSuccess={handleNextStep}
                    data={setupUpdateData}
                    loading={setupUpdateLoading}
                    error={setupUpdateError}
                  />
                )}
                {activeStep === 3 && !completed && (
                  <Three
                    onSubmit={() => setupCompleted()}
                    onSuccess={() => handleThreeSuccess()}
                    loading={setupCompletedLoading}
                    error={setupCompletedError}
                    data={setupCompletedData}
                  />
                )}
                {activeStep === 3 && completed && <Success />}
              </div>
            </div>
          </main>
        </div>
      ) : (
        <Redirects toDashboard />
      )}
    </Spinner>
  );
};

export default SetupStepPageComponent;
