import React from "react";
import _ from "lodash";
import { useSession } from "next-auth/client";

const Table = ({ drivers }) => {
  const [session] = useSession();

  const top10 = _.chain(drivers)
    .orderBy(["score", "username"], ["desc", "asc"])
    .dropRight(drivers.length > 10 ? drivers.length - 10 : 0)
    .value();

  return (
    <div
      className={`relativ overflow-hidden bg-gray-50 ${
        session ? "pb-16" : "pb-32"
      }`}
    >
      <div className="relative pt-12">
        <div className="px-4 mx-auto mt-16 max-w-7xl sm:mt-24">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
              <span className="block xl:inline">Tabuľka 10 najlepších</span>{" "}
              <span className="block text-green-600 xl:inline">
                ekologických šoférov
              </span>
            </h1>
            <p className="max-w-md mx-auto mt-3 text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
              Po dobu 2 týždňov sa šoféri snažia jazdiť úsporne a nakonci budú
              najlepší traja z nich vecne odmenení za ich výkon a budú si môcť
              pochutnať na svojej odmene
            </p>
          </div>
        </div>
        <div className="px-4 pt-16 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="flex flex-col">
            <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                <div className="overflow-hidden border-b border-gray-200 shadow-xs sm:rounded-lg">
                  <table className="min-w-full text-center divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th
                          scope="col"
                          className="px-6 py-3 text-xs font-medium tracking-wider text-gray-500 uppercase"
                        >
                          <svg
                            className="inline w-5 h-5 pb-1 pl-1"
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
                        <th
                          scope="col"
                          className="px-6 py-3 text-xs font-medium tracking-wider text-gray-500 uppercase"
                        >
                          Prezývka šoféra{" "}
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
                              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                            />
                          </svg>
                        </th>

                        <th
                          scope="col"
                          className="px-6 py-3 text-xs font-medium tracking-wider text-gray-500 uppercase"
                        >
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
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {top10.map((driver, i) => {
                        const rank = i + 1;
                        const color =
                          rank === 1
                            ? "red-50"
                            : rank === 2
                            ? "yellow-50"
                            : rank === 3
                            ? "purple-50"
                            : "white";

                        return (
                          <tr
                            className={`bg-${color} border-2 border-dashed ${
                              session?.id === driver.id
                                ? " border-gray-300"
                                : "border-gray-50"
                            }`}
                            key={`driver-${i}`}
                          >
                            <td className="px-6 py-4 text-sm font-medium text-gray-500 whitespace-nowrap">
                              {driver.score === 0 ? "-" : rank}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">
                                {driver.username}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">
                                {driver.score}
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Table;
