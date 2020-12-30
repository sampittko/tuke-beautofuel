import React from "react";

const CompletedStep = ({ title, description }) => (
  <li className="relative overflow-hidden lg:flex-1">
    <div className="border border-gray-200 overflow-hidden border-b-0 rounded-t-md lg:border-0">
      <span
        className="absolute top-0 left-0 w-1 h-full bg-transparent group-hover:bg-gray-200 lg:w-full lg:h-1 lg:bottom-0 lg:top-auto"
        aria-hidden="true"
      ></span>
      <span className="px-6 py-5 flex items-start text-sm font-medium">
        <span className="flex-shrink-0">
          <span className="w-10 h-10 flex items-center justify-center bg-green-600 rounded-full">
            <svg
              className="w-6 h-6 text-white"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </span>
        </span>
        <span className="mt-0.5 ml-4 min-w-0 flex flex-col">
          <span className="text-xs font-semibold uppercase tracking-wide">
            {title}
          </span>
          <span className="text-sm font-medium text-gray-500">
            {description}
          </span>
        </span>
      </span>
    </div>
  </li>
);

export default CompletedStep;
