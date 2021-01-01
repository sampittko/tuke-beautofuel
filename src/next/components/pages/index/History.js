import React from "react";
import Moment from "react-moment";
import { USER_GROUPS } from "../../../utils/constants";

const History = ({ user, phase, tracks }) => {
  const phaseNumber = phase?.number;
  const userGroup = user?.group;

  const actionsVisible =
    phaseNumber === 3 ||
    (phaseNumber === 2 && userGroup === USER_GROUPS.rewards);

  return (
    <>
      <h2 className="max-w-6xl mx-auto mt-8 px-4 text-lg leading-6 font-medium text-gray-900 sm:px-6 lg:px-8">
        História jázd
      </h2>

      <div className="shadow sm:hidden">
        <ul className="mt-2 divide-y divide-gray-200 overflow-hidden shadow sm:hidden">
          {tracks &&
            tracks.map((track, i) => {
              return (
                <li key={`track-${i}`}>
                  <span className="block px-4 py-4 bg-white">
                    <span className="flex items-center space-x-4">
                      <span className="flex-1 flex space-x-2 truncate">
                        <span className="flex flex-col text-gray-500 text-sm truncate">
                          <span># {tracks.length - i}</span>
                          {phaseNumber !== 1 && (
                            <span className="mt-2 rounded-lg inline-flex px-2.5 py-0.5 text-xs font-medium bg-green-100 text-green-800">
                              {track.score}
                            </span>
                          )}
                          <span className="mt-1 inline-flex px-2.5 py-0.5 text-xs font-medium">
                            {track.scoreDistance.toFixed(2)} km /{" "}
                            {track.totalDistance.toFixed(2)} km
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
                          {track.converted ? (
                            <button
                              type="button"
                              className="flex-shrink-0 text-gray-400 p-1 border border-transparent rounded-full shadow-sm bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                className="h-5 w-5 text-white"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M12 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M3 12l6.414 6.414a2 2 0 001.414.586H19a2 2 0 002-2V7a2 2 0 00-2-2h-8.172a2 2 0 00-1.414.586L3 12z"
                                />
                              </svg>
                            </button>
                          ) : (
                            <button
                              type="button"
                              className="flex-shrink-0 text-gray-400 p-1 border border-transparent rounded-full shadow-sm bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                            >
                              <svg
                                className="h-5 w-5 text-white"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
                                ></path>
                              </svg>
                            </button>
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
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col mt-2">
            <div className="align-middle min-w-full overflow-x-auto shadow overflow-hidden sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      #
                    </th>
                    <th className="px-6 py-3 bg-gray-50 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Dĺžka trasy
                    </th>
                    <th className="px-6 py-3 bg-gray-50 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Trvanie
                    </th>
                    <th className="px-6 py-3 bg-gray-50 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Dátum
                    </th>
                    {phaseNumber !== 1 && (
                      <th className="px-6 py-3 bg-gray-50 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Eko skóre
                      </th>
                    )}
                    {actionsVisible && (
                      <th className="px-6 py-3 bg-gray-50 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Akcie
                      </th>
                    )}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {tracks &&
                    tracks.map((track, i) => {
                      return (
                        <tr className="bg-white" key={`track-${i}-small`}>
                          <td className="px-6 py-4 text-left whitespace-nowrap text-sm text-gray-500">
                            {tracks.length - i}
                          </td>
                          <td className="px-6 py-4 text-right whitespace-nowrap text-sm text-gray-500">
                            {track.scoreDistance.toFixed(2)} km /{" "}
                            {track.totalDistance.toFixed(2)} km
                          </td>
                          <td className="px-6 py-4 text-right whitespace-nowrap text-sm text-gray-500">
                            {(track.duration / 60).toFixed(2)} min.
                          </td>
                          <td className="px-6 py-4 text-right whitespace-nowrap text-sm text-gray-500">
                            <Moment date={track.date} format="DD. MM. YYYY" />
                          </td>
                          {phaseNumber !== 1 && (
                            <td className="px-6 py-4 text-right whitespace-nowrap text-sm text-gray-500">
                              <span className="text-gray-900 font-medium">
                                {track.score}
                              </span>
                            </td>
                          )}
                          {actionsVisible && (
                            <td className="px-6 py-4 text-right whitespace-nowrap text-sm text-gray-500 flex items-center justify-end">
                              {track.converted ? (
                                <button
                                  type="button"
                                  className="flex-shrink-0 text-gray-400 p-1 border border-transparent rounded-full shadow-sm bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    className="h-5 w-5 text-white"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M12 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M3 12l6.414 6.414a2 2 0 001.414.586H19a2 2 0 002-2V7a2 2 0 00-2-2h-8.172a2 2 0 00-1.414.586L3 12z"
                                    />
                                  </svg>
                                </button>
                              ) : (
                                <button
                                  type="button"
                                  className="flex-shrink-0 text-gray-400 p-1 border border-transparent rounded-full shadow-sm bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                                >
                                  <svg
                                    className="h-5 w-5 text-white"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth="2"
                                      d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
                                    ></path>
                                  </svg>
                                </button>
                              )}
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
