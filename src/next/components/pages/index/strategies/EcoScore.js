import React, { useEffect, useState } from "react";
import { USER_GROUPS } from "../../../../utils/constants";
import _ from "lodash";

const EcoScore = ({
  recommendation,
  credits,
  score,
  phaseNumber,
  userGroup,
  tracks,
}) => {
  const [currentRecommendation, setCurrentRecommendation] = useState(
    recommendation
  );
  const [animating, setAnimating] = useState(false);
  const [averageScore, setAverageScore] = useState(0);

  useEffect(() => {
    setAnimating(true);
    setTimeout(() => {
      setCurrentRecommendation(recommendation);
      setAnimating(false);
    }, 700);
  }, [recommendation]);

  useEffect(() => {
    setAverageScore(Math.floor(_.meanBy(tracks, "score")));
  }, [tracks]);

  return (
    <div className="overflow-hidden rounded-lg shadow lg:col-span-2 bg-gradient-to-r from-cyan-600 to-green-400">
      <div className="p-5">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <svg
              className="w-6 h-6 text-gray-100"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="flex-1 w-0 ml-5">
            <dl>
              <dt className="text-sm font-medium text-gray-200 uppercase truncate">
                Eko skóre
              </dt>
              <dd>
                <div className="text-lg font-medium text-white">
                  {(phaseNumber === 2 && userGroup === USER_GROUPS.rewards) ||
                  phaseNumber === 3 ? (
                    <>
                      <span className="font-bold">{averageScore}</span> &#8226;{" "}
                      {score - credits} / {score}{" "}
                      <span className="pl-1.5 text-xs opacity-50 lowercase">
                        Priemerné &#8226; Uplatnené na odmeny / Celkové
                      </span>
                    </>
                  ) : (
                    <>
                      <span className="font-bold">{averageScore}</span> &#8226;{" "}
                      {score}{" "}
                      <span className="pl-1.5 text-xs opacity-50 lowercase">
                        Priemerné &#8226; Celkové
                      </span>
                    </>
                  )}
                </div>
              </dd>
            </dl>
          </div>
        </div>
      </div>
      <div className="bg-gray-50 bg-opacity-20 px-5 py-1.5 h-full">
        <div className="text-sm">
          <span href="#" className="font-medium text-gray-100">
            <div className="flex-1 min-w-0 py-0">
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
