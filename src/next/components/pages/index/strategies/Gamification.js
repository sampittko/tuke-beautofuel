import React from "react";
import Link from "next/link";

const Gamification = () => (
  <div className="bg-white overflow-hidden shadow rounded-lg">
    <div className="p-5">
      <div className="flex items-center">
        <div className="flex-shrink-0">
          <svg
            className="h-6 w-6 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
            ></path>
          </svg>
        </div>
        <div className="ml-5 w-0 flex-1">
          <dl>
            <dt className="text-sm font-medium text-gray-500 truncate uppercase">
              V celkovom poradí
            </dt>
            <dd>
              <div className="text-lg font-medium text-green-900 uppercase">
                druhý
              </div>
            </dd>
          </dl>
        </div>
      </div>
    </div>
    <div className="bg-gray-50 px-5 py-3 sm:py-7 lg:py-3">
      <div className="text-sm">
        <Link
          href="/top10"
          className="font-medium text-gray-700 hover:text-cyan-900"
        >
          Zobraziť tabuľku
        </Link>
      </div>
    </div>
  </div>
);

export default Gamification;
