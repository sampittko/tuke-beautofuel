import { useMutation } from "@apollo/client";
import { useSession } from "next-auth/client";
import React, { useState } from "react";
import UsersAPI from "../../../lib/api/users";

const PhaseBanner = ({ phaseNumber, user }) => {
  const [session] = useSession();
  const [visible, setVisible] = useState(!user?.[`notified${phaseNumber}`]);

  const [notified] = useMutation(UsersAPI.notified, {
    variables: {
      userId: session.id,
      notified1: (phaseNumber === 1 && !user.notified1) || user.notified1,
      notified2: (phaseNumber === 2 && !user.notified2) || user.notified2,
      notified3: (phaseNumber === 3 && !user.notified3) || user.notified3,
    },
  });

  const handleClick = () => {
    notified();
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 inset-x-0 pb-2 sm:pb-5">
      <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
        <div className="p-2 rounded-lg bg-green-600 shadow-lg sm:p-3">
          <div className="flex items-center justify-between flex-wrap">
            <div className="w-0 flex-1 flex items-center">
              <span className="flex p-2 rounded-lg bg-green-800">
                <svg
                  className="h-6 w-6 text-white"
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
                    d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z"
                  />
                </svg>
              </span>
              <p className="ml-3 font-medium text-white truncate">
                <span className="md:hidden">
                  Práve prebieha fáza experimentu č. {phaseNumber}!
                </span>
                <span className="hidden md:inline">
                  {phaseNumber === 1 &&
                    "Experiment už prebieha vo fáze č. 1. Môžete začať so synchronizáciou svojich jázd!"}
                  {phaseNumber === 2 &&
                    "Začala sa fáza experimentu č. 2 a na tejto obrazovke nájdete nové funkcie!"}
                  {phaseNumber === 3 &&
                    "Začala sa fáza experimentu č. 3 a na tejto obrazovke nájdete ďalšie nové funkcie!"}
                </span>
              </p>
            </div>
            <div className="order-3 mt-2 flex-shrink-0 w-full sm:order-2 sm:mt-0 sm:w-auto">
              <a
                href="/prehlad-experimentu"
                className="flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-green-600 bg-white hover:bg-green-50"
              >
                Zistite viac
              </a>
            </div>
            <div className="order-2 flex-shrink-0 sm:order-3 sm:ml-2">
              <button
                onClick={handleClick}
                type="button"
                className="-mr-1 flex p-2 rounded-md hover:bg-green-500 focus:outline-none focus:ring-2 focus:ring-white"
              >
                <span className="sr-only">Rozumiem</span>
                <svg
                  className="h-6 w-6 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PhaseBanner;
