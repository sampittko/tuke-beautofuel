import { Transition } from "@headlessui/react";
import React from "react";

const PurchaseNotification = ({ purchaseDetails }) => (
  <div className="fixed bottom-0 right-0 z-10 flex items-end justify-center w-full px-4 py-6 pointer-events-none sm:p-6 sm:items-start sm:justify-end">
    <Transition
      as="div"
      className="w-full max-w-sm overflow-hidden bg-white rounded-lg shadow-lg pointer-events-auto ring-1 ring-black ring-opacity-5"
      show={!!purchaseDetails}
      enter="transform ease-out duration-300 transition"
      enterFrom="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
      enterTo="translate-y-0 opacity-100 sm:translate-x-0"
      leave="transition ease-in duration-100"
      leaveFrom="opacity-100"
      leaveTo="opacity-0"
    >
      <div className="h-20 p-4">
        {purchaseDetails && (
          <div className="flex items-start">
            <div className="flex-shrink-0">
              {purchaseDetails?.purchased ? (
                <svg
                  className="w-6 h-6 text-green-400"
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
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  className="w-6 h-6 text-gray-600"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M3 12l6.414 6.414a2 2 0 001.414.586H19a2 2 0 002-2V7a2 2 0 00-2-2h-8.172a2 2 0 00-1.414.586L3 12z"
                  />
                </svg>
              )}
            </div>
            <div className="ml-3 w-0 flex-1 pt-0.5">
              <p className="text-sm font-medium text-gray-900">
                {purchaseDetails?.purchased
                  ? "Získali ste odmeny za jazdu"
                  : "Vrátili ste odmeny za jazdu"}
              </p>
              <p className="mt-1 text-sm text-gray-500">
                {`Počet kroviek: ${purchaseDetails?.quantity}`}
              </p>
            </div>
          </div>
        )}
      </div>
    </Transition>
  </div>
);

export default PurchaseNotification;
