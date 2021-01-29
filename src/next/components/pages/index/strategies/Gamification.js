import React, { useEffect, useState } from "react";
import Link from "next/link";
import _ from "lodash";
import { USER_GROUPS } from "../../../../utils/constants";
import { useSession } from "next-auth/client";

const Gamification = ({ allUsers, phaseNumber }) => {
  const [session] = useSession();
  const [rank, setRank] = useState("bez poradia");

  useEffect(() => {
    if (allUsers) {
      const filteredUsers = allUsers.filter((user) => {
        let phaseFilter = true;
        if (phaseNumber === 2) {
          phaseFilter = user.group !== USER_GROUPS.rewards;
        }

        return user.group !== USER_GROUPS.unassigned && phaseFilter;
      });

      const sortedUsers = _.orderBy(
        filteredUsers,
        [`wallet.score${phaseNumber}`, "username"],
        ["desc", "asc"]
      );

      const newRank =
        sortedUsers.findIndex((user) => user.id === session.id) + 1;

      const newRankString =
        newRank === 1
          ? "prvý"
          : newRank === 2
          ? "druhý"
          : newRank === 3
          ? "tretí"
          : `${newRank}.`;

      setRank(newRankString);
    }
  }, [allUsers]);

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
            Zobraziť tabuľku
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Gamification;
