import React, { useEffect, useState } from "react";
import _ from "lodash";

const Rewards = ({ tracks }) => {
  const [krovkyCount, setKrovkyCount] = useState(0);

  useEffect(() => {
    if (tracks) {
      const newKrovkyCount = _.chain(tracks)
        .filter((track) => !!track.purchase?.made)
        .sumBy("purchase.quantity")
        .value();
      setKrovkyCount(newKrovkyCount);
    }
  }, [tracks]);

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
                d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7"
              ></path>
            </svg>
          </div>
          <div className="flex-1 w-0 ml-5">
            <dl>
              <dt className="text-sm font-medium text-gray-500 uppercase truncate">
                Získané krovky
              </dt>
              <dd>
                <div className="text-lg font-medium text-green-900">
                  {krovkyCount} ks / {krovkyCount * 7} g
                </div>
              </dd>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Rewards;
