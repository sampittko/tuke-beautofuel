import React from "react";
import { USER_GROUPS } from "../../../utils/constants";

const History = ({ user, phase }) => {
  const phaseNumber = phase?.phase.number;
  const userGroup = user?.user.group;

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
          <li>
            <span className="block px-4 py-4 bg-white">
              <span className="flex items-center space-x-4">
                <span className="flex-1 flex space-x-2 truncate">
                  <span className="flex flex-col text-gray-500 text-sm truncate">
                    <span># 2</span>
                    <span>
                      <span className="text-gray-900 font-medium">3589</span>
                    </span>
                    <span>34 km</span>
                    <span>20 min.</span>
                    <span>12. 12. 2020</span>
                  </span>
                </span>

                {actionsVisible && (
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
              </span>
            </span>
          </li>
          <li>
            <span className="block px-4 py-4 bg-white">
              <span className="flex items-center space-x-4">
                <span className="flex-1 flex space-x-2 truncate">
                  <span className="flex flex-col text-gray-500 text-sm truncate">
                    <span># 1</span>
                    <span>
                      <span className="text-gray-900 font-medium">3589</span>
                    </span>
                    <span>34 km</span>
                    <span>20 min.</span>
                    <span>12. 12. 2020</span>
                  </span>
                </span>
                {actionsVisible && (
                  <button
                    type="button"
                    className="flex-shrink-0 text-gray-400 p-1 border border-transparent rounded-full shadow-sm bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  >
                    <svg
                      className="w-5 h-5 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"
                      ></path>
                    </svg>
                  </button>
                )}
              </span>
            </span>
          </li>
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
                    <th className="px-6 py-3 bg-gray-50 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Eko skóre
                    </th>
                    {actionsVisible && (
                      <th className="px-6 py-3 bg-gray-50 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Akcie
                      </th>
                    )}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  <tr className="bg-white">
                    <td className="px-6 py-4 text-left whitespace-nowrap text-sm text-gray-500">
                      2
                    </td>
                    <td className="px-6 py-4 text-right whitespace-nowrap text-sm text-gray-500">
                      34,5 km
                    </td>
                    <td className="px-6 py-4 text-right whitespace-nowrap text-sm text-gray-500">
                      20 min.
                    </td>
                    <td className="px-6 py-4 text-right whitespace-nowrap text-sm text-gray-500">
                      14. 12. 2020
                    </td>
                    <td className="px-6 py-4 text-right whitespace-nowrap text-sm text-gray-500">
                      <span className="text-gray-900 font-medium">3589</span>
                    </td>
                    {actionsVisible && (
                      <td className="px-6 py-4 text-right whitespace-nowrap text-sm text-gray-500 flex items-center justify-end">
                        <button
                          type="button"
                          className="inline-flex items-center p-1 border border-transparent rounded-full shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                        >
                          <svg
                            className="h-5 w-5"
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
                      </td>
                    )}
                  </tr>
                  <tr className="bg-white">
                    <td className="px-6 py-4 text-left whitespace-nowrap text-sm text-gray-500">
                      1
                    </td>
                    <td className="px-6 py-4 text-right whitespace-nowrap text-sm text-gray-500">
                      34 km
                    </td>
                    <td className="px-6 py-4 text-right whitespace-nowrap text-sm text-gray-500">
                      25 min.
                    </td>
                    <td className="px-6 py-4 text-right whitespace-nowrap text-sm text-gray-500">
                      12. 12. 2020
                    </td>
                    <td className="px-6 py-4 text-right whitespace-nowrap text-sm text-gray-500">
                      <span className="text-gray-900 font-medium">3589</span>
                    </td>
                    {actionsVisible && (
                      <td className="px-6 py-4 text-right whitespace-nowrap text-sm text-gray-500 flex items-center justify-end">
                        <button
                          type="button"
                          className="inline-flex items-center p-1 border border-transparent rounded-full shadow-sm text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                        >
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"
                            ></path>
                          </svg>
                        </button>
                      </td>
                    )}
                  </tr>
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
