import React, { useEffect, useState } from "react";
import Moment from "react-moment";
import { USER_GROUPS } from "../../../../utils/constants";
import { formatDistance, formatDuration } from "../../../../utils/functions";
import Convert from "./actions/Convert";
import Revert from "./actions/Revert";
import _ from "lodash";

const History = ({
  user,
  phase,
  tracks,
  tracksRefetch,
  userRefetch,
  allUsersRefetch,
}) => {
  const [sortedTracks, setSortedTracks] = useState([]);

  const phaseNumber = phase?.number;
  const userGroup = user?.group;

  const actionsVisible =
    phaseNumber === 3 ||
    (phaseNumber === 2 && userGroup === USER_GROUPS.rewards);

  useEffect(() => {
    if (tracks) {
      const newSortedTracks = _.orderBy(tracks, ["date"], ["desc"]);
      setSortedTracks(newSortedTracks);
    }
  }, [tracks]);

  return (
    <>
      <h2 className="max-w-6xl px-4 mx-auto mt-8 text-lg font-medium leading-6 text-gray-900 sm:px-6 lg:px-8">
        História jázd
      </h2>

      <div className="shadow sm:hidden">
        <ul className="mt-2 overflow-hidden divide-y divide-gray-200 shadow sm:hidden">
          {sortedTracks.map((track, i) => {
            return (
              <li key={`track-${i}`}>
                <span className="block px-4 py-4 bg-white">
                  <span className="flex items-center space-x-4">
                    <span className="flex flex-1 space-x-2 truncate">
                      <span className="flex flex-col text-sm text-gray-500 truncate">
                        <span># {tracks.length - i}</span>
                        {phaseNumber !== 1 && (
                          <span className="mt-2 rounded-lg inline-flex px-2.5 py-0.5 text-xs font-medium bg-green-100 text-green-800">
                            {track.score}
                          </span>
                        )}
                        <span className="mt-1 inline-flex px-2.5 py-0.5 text-xs font-medium">
                          {phaseNumber !== 1 && (
                            <>{formatDistance(track.scoreDistance)} / </>
                          )}
                          {formatDistance(track.totalDistance)}
                        </span>
                        <span className="mt-1 inline-flex px-2.5 py-0.5 text-xs font-medium">
                          {(track.duration / 60).toFixed(2)} min.
                        </span>
                        <span className="mt-1 inline-flex px-2.5 py-0.5 text-xs font-medium">
                          <Moment date={track.date} format="DD. MM. YYYY" />
                        </span>
                      </span>
                    </span>

                    {actionsVisible && (
                      <>
                        {track.purchase?.made ? (
                          <Revert
                            tracksRefetch={tracksRefetch}
                            userRefetch={userRefetch}
                            allUsersRefetch={allUsersRefetch}
                            track={track}
                          />
                        ) : (
                          <Convert
                            tracksRefetch={tracksRefetch}
                            userRefetch={userRefetch}
                            allUsersRefetch={allUsersRefetch}
                            track={track}
                          />
                        )}
                      </>
                    )}
                  </span>
                </span>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="hidden sm:block">
        <div className="max-w-6xl px-4 mx-auto sm:px-6 lg:px-8">
          <div className="flex flex-col mt-2">
            <div className="min-w-full overflow-hidden overflow-x-auto align-middle shadow sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase bg-gray-50">
                      <svg
                        className="inline w-5 h-5 pb-1 pr-1"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14"
                        />
                      </svg>
                    </th>
                    <th className="px-6 py-3 text-xs font-medium tracking-wider text-right text-gray-500 uppercase bg-gray-50">
                      Dĺžka trasy{" "}
                      <svg
                        className="inline w-5 h-5 pb-1"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          fill="#fff"
                          d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0"
                        />
                      </svg>
                    </th>
                    <th className="px-6 py-3 text-xs font-medium tracking-wider text-right text-gray-500 uppercase bg-gray-50">
                      Trvanie{" "}
                      <svg
                        className="inline w-5 h-5 pb-1"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </th>
                    <th className="px-6 py-3 text-xs font-medium tracking-wider text-right text-gray-500 uppercase bg-gray-50">
                      Dátum{" "}
                      <svg
                        className="inline w-5 h-5 pb-1"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                    </th>
                    {phaseNumber !== 1 && (
                      <th className="px-6 py-3 text-xs font-medium tracking-wider text-right text-gray-500 uppercase bg-gray-50">
                        Eko skóre{" "}
                        <svg
                          className="inline w-5 h-5 pb-1"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z"
                          />
                        </svg>
                      </th>
                    )}
                    {actionsVisible && (
                      <th className="px-6 py-3 text-xs font-medium tracking-wider text-right text-gray-500 uppercase bg-gray-50">
                        Akcie{" "}
                        <svg
                          className="inline w-5 h-5 pb-1"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 8h16M4 16h16"
                          />
                        </svg>
                      </th>
                    )}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {sortedTracks.map((track, i) => {
                    return (
                      <tr className="bg-white" key={`track-${i}-small`}>
                        <td className="px-6 py-4 text-sm text-left text-gray-500 whitespace-nowrap">
                          {tracks.length - i}
                        </td>
                        <td className="px-6 py-4 text-sm text-right text-gray-500 whitespace-nowrap">
                          {phaseNumber !== 1 && (
                            <>{formatDistance(track.scoreDistance)} / </>
                          )}
                          {formatDistance(track.totalDistance)}
                        </td>
                        <td className="px-6 py-4 text-sm text-right text-gray-500 whitespace-nowrap">
                          {formatDuration(track.duration)}
                        </td>
                        <td className="px-6 py-4 text-sm text-right text-gray-500 whitespace-nowrap">
                          <Moment date={track.date} format="DD. MM. YYYY" />
                        </td>
                        {phaseNumber !== 1 && (
                          <td className="px-6 py-4 text-sm text-right text-gray-500 bg-green-100 whitespace-nowrap">
                            <span className="font-medium text-gray-900">
                              {track.score}
                            </span>
                          </td>
                        )}
                        {actionsVisible && (
                          <td className="flex items-center justify-end px-6 py-4 text-sm text-right text-gray-500 whitespace-nowrap">
                            <>
                              {track.purchase?.made ? (
                                <Revert
                                  allUsersRefetch={allUsersRefetch}
                                  tracksRefetch={tracksRefetch}
                                  userRefetch={userRefetch}
                                  track={track}
                                />
                              ) : (
                                <Convert
                                  allUsersRefetch={allUsersRefetch}
                                  tracksRefetch={tracksRefetch}
                                  userRefetch={userRefetch}
                                  track={track}
                                />
                              )}
                            </>
                          </td>
                        )}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default History;
