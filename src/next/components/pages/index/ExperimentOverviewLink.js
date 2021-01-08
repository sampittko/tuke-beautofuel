import React from "react";
import { getExperimentOverviewLink } from "../../../utils/functions";

const ExperimentOverviewLink = ({ userGroup, phaseNumber }) => (
  <a
    href={getExperimentOverviewLink(userGroup, phaseNumber)}
    target="_blank"
    title={`Zobraziť prehľad fázy experimentu č. ${phaseNumber}`}
  >
    <div className="fixed bottom-0 left-0 p-3 m-10 text-white bg-gray-600 rounded-full lg:m-16 hover:bg-gray-700">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        className=" w-9 h-9"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    </div>
  </a>
);

export default ExperimentOverviewLink;
