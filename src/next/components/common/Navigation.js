import { signOut, useSession } from "next-auth/client";
import Image from "next/image";
import React from "react";

const Navigation = () => {
  const [session] = useSession();

  return (
    <div className="relative z-10 flex flex-shrink-0 h-16 bg-white border-b border-gray-200 lg:border-none">
      <div className="flex justify-between flex-1 px-4 sm:px-6 lg:max-w-6xl lg:mx-auto lg:px-8">
        <div className="flex">
          <div className="flex items-center flex-shrink-0">
            <a href="/" className="pt-2">
              <Image
                width={60}
                height={32}
                className="block w-auto h-8 lg:p-2"
                src="/images/beautofuel_logo.png"
                alt="enviroCar logo"
              />
            </a>
          </div>
        </div>
        {session && (
          <div className="flex items-center ml-4 md:ml-6">
            <div className="relative ml-3">
              <div className="flex items-center max-w-xs text-sm bg-white rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 lg:py-2 lg:rounded-md">
                <button
                  type="button"
                  className="inline-flex items-center px-3 py-2 text-sm font-medium leading-4 text-green-700 border border-transparent rounded-md hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  onClick={(event) => {
                    event.preventDefault();
                    signOut();
                  }}
                >
                  Odhlásenie
                  <svg
                    className="ml-2 -mr-0.5 h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                    ></path>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navigation;
