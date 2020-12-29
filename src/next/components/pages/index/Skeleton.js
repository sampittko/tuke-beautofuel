import { Transition } from "@headlessui/react";
import React from "react";

const Skeleton = ({ visible, children }) => {
  if (!visible)
    return (
      <Transition
        show={!visible}
        enter="transition ease-out duration-500"
        enterFrom="transform opacity-0 scale-90"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-200"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-90"
      >
        {children}
      </Transition>
    );

  return (
    <>
      <div className="mt-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div class="h-4 bg-green-400 rounded w-2/12" />
            <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="rounded-full bg-green-300 h-6 w-6" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <div class="h-4 bg-green-400 rounded w-1/2 mb-4" />
                      <div class="h-4 bg-green-400 rounded w-2/12" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="rounded-full bg-green-300 h-6 w-6" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <div class="h-4 bg-green-400 rounded w-3/4 mb-4" />
                      <div class="h-4 bg-green-400 rounded w-2/12" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <h2 className="max-w-6xl mx-auto mt-8 mb-4 text-lg leading-6 font-medium text-gray-900">
              <div class="h-4 bg-green-400 rounded w-2/12" />
            </h2>

            <div className="shadow sm:hidden">
              <ul className="mt-2 divide-y divide-gray-200 overflow-hidden shadow sm:hidden">
                <li>
                  <div className="block px-4 py-4 bg-white">
                    <div className="flex items-center space-x-4">
                      <div className="flex-1 flex space-x-2">
                        <div className="flex flex-col">
                          <div class="h-3 bg-green-300 rounded w-4/12 mb-2" />
                          <div class="h-3 bg-green-300 rounded w-3/4 mb-2" />
                          <div class="h-3 bg-green-300 rounded w-1/2 mb-2" />
                          <div class="h-3 bg-green-300 rounded w-1/2 mb-2" />
                          <div className="invisible -mb-8">12. 12. 2020</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
                <li>
                  <div className="block px-4 py-4 bg-white">
                    <div className="flex items-center space-x-4">
                      <div className="flex-1 flex space-x-2">
                        <div className="flex flex-col">
                          <div class="h-3 bg-green-300 rounded w-4/12 mb-2" />
                          <div class="h-3 bg-green-300 rounded w-3/4 mb-2" />
                          <div class="h-3 bg-green-300 rounded w-1/2 mb-2" />
                          <div class="h-3 bg-green-300 rounded w-1/2 mb-2" />
                          <div className="invisible -mb-8">12. 12. 2020</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              </ul>
            </div>

            <div className="hidden sm:block">
              <div className="max-w-6xl mx-auto">
                <div className="flex flex-col mt-2">
                  <div className="align-middle min-w-full overflow-x-auto shadow overflow-hidden sm:rounded-lg">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead>
                        <tr className="h-10">
                          <th className="relative px-6 py-3 bg-gray-50">
                            <div class="absolute top-3 h-4 bg-green-400 rounded w-2/12 mb-4" />
                          </th>
                          <th className="relative px-6 py-3 bg-gray-50">
                            <div class="absolute top-3 right-0 h-4 bg-green-400 rounded w-1/2 mb-4" />
                          </th>
                          <th className="relative px-6 py-3 bg-gray-50">
                            <div class="absolute top-3 right-0 h-4 bg-green-400 rounded w-1/2 mb-4" />
                          </th>
                          <th className="relative px-6 py-3 bg-gray-50">
                            <div class="absolute top-3 right-0 h-4 bg-green-400 rounded w-2/12 mb-4" />
                          </th>
                          <th className="relative px-6 py-3 bg-gray-50">
                            <div class="absolute top-3 right-2 h-4 bg-green-400 rounded w-1/2 mb-4" />
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        <tr className="bg-white h-12">
                          <td className="relative px-6 py-4">
                            <div class="absolute top-4 left-6 h-4 bg-green-400 rounded w-2/12 mb-4" />
                          </td>
                          <td className="relative px-6 py-4">
                            <div class="absolute top-4 right-0 h-4 bg-green-400 rounded w-4/12 mb-4" />
                          </td>
                          <td className="relative px-6 py-4">
                            <div class="absolute top-4 right-0 h-4 bg-green-400 rounded w-4/12 mb-4" />
                          </td>
                          <td className="relative px-6 py-4">
                            <div class="absolute top-4 right-0 h-4 bg-green-400 rounded w-1/2 mb-4" />
                          </td>
                          <td className="relative px-6 py-4">
                            <div class="absolute top-4 right-2 h-4 bg-green-400 rounded w-2/12 mb-4" />
                          </td>
                        </tr>
                        <tr className="bg-white h-12">
                          <td className="relative px-6 py-4">
                            <div class="absolute top-4 left-6 h-4 bg-green-400 rounded w-2/12 mb-4" />
                          </td>
                          <td className="relative px-6 py-4">
                            <div class="absolute top-4 right-0 h-4 bg-green-400 rounded w-4/12 mb-4" />
                          </td>
                          <td className="relative px-6 py-4">
                            <div class="absolute top-4 right-0 h-4 bg-green-400 rounded w-4/12 mb-4" />
                          </td>
                          <td className="relative px-6 py-4">
                            <div class="absolute top-4 right-0 h-4 bg-green-400 rounded w-1/2 mb-4" />
                          </td>
                          <td className="relative px-6 py-4">
                            <div class="absolute top-4 right-2 h-4 bg-green-400 rounded w-2/12 mb-4" />
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Skeleton;
