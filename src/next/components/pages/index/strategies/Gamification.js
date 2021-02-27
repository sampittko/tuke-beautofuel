import React, { useEffect, useState } from "react";
import Link from "next/link";

const Gamification = ({ position }) => {
  const [rank, setRank] = useState("Bez poradia");

  useEffect(() => {
    if (position) {
      let positionString;

      switch (position) {
        case 1:
          positionString = "Prvý";
          break;
        case 2:
          positionString = "Druhý";
          break;
        case 3:
          positionString = "Tretí";
          break;
        case 4:
          positionString = "Štvrtý";
          break;
        case 5:
          positionString = "Piaty";
          break;
        case 6:
          positionString = "Šiesty";
          break;
        case 7:
          positionString = "Siedmy";
          break;
        case 8:
          positionString = "Ôsmy";
          break;
        case 9:
          positionString = "Deviaty";
          break;
        case 10:
          positionString = "Desiaty";
          break;
        default:
          positionString = "11. a viac";
          break;
      }

      setRank(positionString);
    }
  }, [position]);

  return (
    <div className="overflow-hidden bg-white rounded-lg shadow">
      <div className="p-5">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <svg
              className="w-6 h-6 text-gray-400"
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
          <div className="flex-1 w-0 ml-5">
            <dl>
              <dt className="text-sm font-medium text-gray-500 uppercase truncate">
                V celkovom poradí
              </dt>
              <dd>
                <div className="text-lg font-medium text-green-900 uppercase">
                  {rank}
                </div>
              </dd>
            </dl>
          </div>
        </div>
      </div>
      <div className="px-5 py-3 bg-gray-50 sm:py-7 lg:py-3">
        <div className="text-sm">
          <Link
            href="/top10"
            className="font-medium text-gray-700 hover:text-cyan-900"
          >
            Zobraziť celkové poradie
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Gamification;
