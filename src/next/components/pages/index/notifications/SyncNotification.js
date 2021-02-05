import { Transition } from "@headlessui/react";
import React from "react";

const SyncNotification = ({ show, error }) => (
  <div className="fixed bottom-0 right-0 z-10 flex items-end justify-center w-full px-4 py-6 pointer-events-none sm:p-6 sm:items-start sm:justify-end">
    <Transition
      as="div"
      className="w-full max-w-sm overflow-hidden bg-white rounded-lg shadow-lg pointer-events-auto ring-1 ring-black ring-opacity-5"
      show={show}
      enter="transform ease-out duration-300 transition"
      enterFrom="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
      enterTo="translate-y-0 opacity-100 sm:translate-x-0"
      leave="transition ease-in duration-100"
      leaveFrom="opacity-100"
      leaveTo="opacity-0"
    >
      <div className="h-20 p-4">
        {show && (
          <div className="flex items-start">
            <div className="flex-shrink-0">
              {!error ? (
                <svg
                  className="w-6 h-6 text-green-400"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              ) : (
                <svg
                  className="w-6 h-6 text-red-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  ></path>
                </svg>
              )}
            </div>
            <div className="ml-3 w-0 flex-1 pt-0.5">
              <p className="text-sm font-medium text-gray-900">
                {!error
                  ? "Synchronizácia bola úspešná"
                  : "Synchronizácia sa nepodarila"}
              </p>
              <p className="mt-1 text-sm text-gray-500">
                {!error
                  ? "Vaše štatistiky boli aktualizované"
                  : "Skontrolujte svoje heslo a skúste znovu"}
              </p>
            </div>
          </div>
        )}
      </div>
    </Transition>
  </div>
);

export default SyncNotification;
