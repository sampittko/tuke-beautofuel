import React from "react";
import Head from "next/head";
import CurrentStep from "./CurrentStep";
import CompletedStep from "./CompletedStep";
import UpcomingStep from "./UpcomingStep";
import { TOTAL_SETUP_STEPS_COUNT } from "../../../../../pages/setup/[step]";

const steps = [
  {
    title: "Základné údaje",
    description: "Ako budete viditeľný pre ostatných",
  },
  {
    title: "enviroCar",
    description: "Nastavenie služby tretej strany",
  },
  {
    title: "Zber dát",
    description: "Dáta zhromažďované počas experimentu",
  },
];

const Stepper = ({ activeStep }) => (
  <>
    <Head>
      <title>
        Krok {activeStep}/{TOTAL_SETUP_STEPS_COUNT} pred spustením | beautofuel
      </title>
    </Head>
    <div className="lg:border-t lg:border-b bg-white lg:border-gray-200">
      <nav
        className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"
        aria-label="Progress"
      >
        <ol className="rounded-md overflow-hidden lg:flex lg:border-l lg:border-r lg:border-gray-200 lg:rounded-none">
          {steps.map((step, i) => {
            const stepOrder = i + 1;
            const stepProps = { key: i, number: stepOrder, ...step };
            if (stepOrder === activeStep) {
              return <CurrentStep {...stepProps} />;
            }
            if (stepOrder > activeStep) {
              return <UpcomingStep {...stepProps} />;
            }
            return <CompletedStep {...stepProps} />;
          })}
        </ol>
      </nav>
    </div>
  </>
);

export default Stepper;
