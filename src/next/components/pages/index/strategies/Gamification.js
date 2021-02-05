import React, { useEffect, useState } from "react";
import Link from "next/link";
import _ from "lodash";
import { USER_GROUPS } from "../../../../utils/constants";
import { useSession } from "next-auth/client";

const Gamification = ({ allTracks, allUsers, phaseNumber }) => {
  const [session] = useSession();
  const [rank, setRank] = useState("Bez poradia");

  useEffect(() => {
    if (allTracks && allUsers) {
      const allUsernamesByStrategy = allUsers;
      const driversWithTracksObject = _.chain(allTracks)
        .groupBy("user.username")
        .map((track, key, tracks) => ({
          username: key,
          id: track[0].user.id,
          score: Math.floor(
            track[0].user.wallet[`score${phaseNumber}`] / tracks[key].length
          ),
          group: track[0].user.group,
        }))
        .keyBy("username")
        .value();

      const allUsernames = [
        ...allUsernamesByStrategy.gamificationUsernames,
        ...allUsernamesByStrategy.rewardsUsernames,
      ];

      allUsernames.forEach((driver) => {
        if (!driversWithTracksObject[`${driver.username}`]) {
          driversWithTracksObject[`${driver.username}`] = {
            id: driver.id,
            username: driver.username,
            score: 0,
            group: driver.group,
          };
        }
      });

      let newDrivers = [];

      _.forOwn(driversWithTracksObject, (value) => {
        if (phaseNumber === 3 || value.group === USER_GROUPS.gamification) {
          newDrivers.push(value);
        }
      });

      console.log(newDrivers);

      newDrivers = _.orderBy(
        newDrivers,
        ["score", "username"],
        ["desc", "asc"]
      );

      console.log(newDrivers);

      const newRank = newDrivers.findIndex((elm) => elm.id === session.id) + 1;

      let newRankString;

      switch (newRank) {
        case 1:
          newRankString = "Prvý";
          break;
        case 2:
          newRankString = "Druhý";
          break;
        case 3:
          newRankString = "Tretí";
          break;
        case 4:
          newRankString = "Štvrtý";
          break;
        case 5:
          newRankString = "Piaty";
          break;
        case 6:
          newRankString = "Šiesty";
          break;
        case 7:
          newRankString = "Siedmy";
          break;
        case 8:
          newRankString = "Ôsmy";
          break;
        case 9:
          newRankString = "Deviaty";
          break;
        case 10:
          newRankString = "Desiaty";
          break;
        default:
          newRankString = `${newRank}.`;
          break;
      }

      setRank(newRankString);
    }
  }, [allTracks, allUsers]);

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
