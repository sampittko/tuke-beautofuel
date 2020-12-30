import React from "react";

const CurrentStep = ({ title, description, number }) => (
  <li className="relative overflow-hidden lg:flex-1">
    <div className="border border-gray-200 overflow-hidden lg:border-0">
      <span
        className="absolute top-0 left-0 w-1 h-full bg-green-600 lg:w-full lg:h-1 lg:bottom-0 lg:top-auto"
        aria-hidden="true"
      ></span>
      <span className="px-6 py-5 flex items-start text-sm font-medium lg:pl-9">
        <span className="flex-shrink-0">
          <span className="w-10 h-10 flex items-center justify-center border-2 border-green-600 rounded-full">
            <span className="text-green-600">0{number}</span>
          </span>
        </span>
        <span className="mt-0.5 ml-4 min-w-0 flex flex-col">
          <span className="text-xs font-semibold text-green-600 uppercase tracking-wide">
            {title}
          </span>
          <span className="text-sm font-medium text-gray-500">
            {description}
          </span>
        </span>
      </span>

      <div
        className="hidden absolute top-0 left-0 w-3 inset-0 lg:block"
        aria-hidden="true"
      >
        <svg
          className="h-full w-full text-gray-300"
          viewBox="0 0 12 82"
          fill="none"
          preserveAspectRatio="none"
        >
          <path
            d="M0.5 0V31L10.5 41L0.5 51V82"
            stroke="currentcolor"
            vectorEffect="non-scaling-stroke"
          />
        </svg>
      </div>
    </div>
  </li>
);

export default CurrentStep;
