import React, { useState } from "react";
import Stepper from "./stepper";
import One from "./One";
import Two from "./Two";
import Three from "./Three";
import Navigation from "../../../common/Navigation";
import { useRouter } from "next/router";

const SetupStepPageComponent = ({
  activeStep,
  onStepChange: handleNextStep,
}) => {
  const [username, setUsername] = useState("");
  const router = useRouter();

  const handleSubmit = (e) => {
    e.preventDefault();
    const nextStep = activeStep + 1;
    router.replace(`/setup/${nextStep}`);
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
            <Stepper activeStep={activeStep} />
            {activeStep === 1 && (
              <One
                username={username}
                setUsername={setUsername}
                onSubmit={handleSubmit}
              />
            )}
            {activeStep === 2 && <Two />}
            {activeStep === 3 && <Three />}
          </div>
        </div>
      </main>
    </div>
  );
};

export default SetupStepPageComponent;
