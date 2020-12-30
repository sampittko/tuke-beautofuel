import React, { useState } from "react";
import Stepper from "./stepper";
import One from "./One";
import Two from "./Two";
import Three from "./Three";
import Navigation from "../../../common/Navigation";

const SetupStepPageComponent = ({
  activeStep,
  onStepChange: handleNextStep,
}) => {
  const [username, setUsername] = useState("");
  const [envirocar, setEnvirocar] = useState("");

  return (
    <div className="bg-gray-50 min-h-screen">
      <Navigation />
      <div className="bg-green-800 pb-32">
        <header className="py-10"></header>
      </div>

      <main className="-mt-32">
        <div className="max-w-7xl mx-auto pb-12 px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow py-6">
            <Stepper activeStep={activeStep} />
            {activeStep === 1 && (
              <One
                username={username}
                onUsernameChange={setUsername}
                onSubmit={handleNextStep}
              />
            )}
            {activeStep === 2 && (
              <Two
                envirocar={envirocar}
                onEnvirocarChange={setEnvirocar}
                onSubmit={handleNextStep}
              />
            )}
            {activeStep === 3 && <Three />}
          </div>
        </div>
      </main>
    </div>
  );
};

export default SetupStepPageComponent;
