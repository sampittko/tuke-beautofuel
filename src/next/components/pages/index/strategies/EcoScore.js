import React, { useEffect, useState } from "react";

const EcoScore = ({ recommendation, score }) => {
  const [currentRecommendation, setCurrentRecommendation] = useState(
    recommendation
  );
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    setAnimating(true);
    setTimeout(() => {
      setCurrentRecommendation(recommendation);
      setAnimating(false);
    }, 700);
  }, [recommendation]);

  return (
    <div className="lg:col-span-2 bg-gradient-to-r from-cyan-600 to-green-400 overflow-hidden shadow rounded-lg">
      <div className="p-5">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <svg
              className="h-6 w-6 text-gray-100"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
              ></path>
            </svg>
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-200 truncate uppercase">
                Eko skóre
              </dt>
              <dd>
                <div className="text-lg font-medium text-white">{score}</div>
              </dd>
            </dl>
          </div>
        </div>
      </div>
      <div className="bg-gray-50 bg-opacity-20 px-5 py-1.5 h-full">
        <div className="text-sm">
          <span href="#" className="font-medium text-gray-100">
            <div className="min-w-0 flex-1 py-0">
              <div className="text-sm leading-8 text-gray-100">
                <span className="mr-2">
                  <span className="relative inline-flex items-center rounded-full border border-gray-300 px-3 py-0.5 text-sm">
                    <span className="font-medium uppercase">Tip</span>
                  </span>
                </span>
                <span
                  className={`transition-opacity duration-500 ${
                    animating ? "opacity-0" : "opacity-1000"
                  }`}
                >
                  {currentRecommendation}
                </span>
              </div>
            </div>
          </span>
        </div>
      </div>
    </div>
  );
};

export default EcoScore;
