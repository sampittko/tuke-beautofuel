import { useSession } from "next-auth/client";
import React, { useRef } from "react";
import Moment from "react-moment";
import SyncButton from "./SyncButton";
import Typewriter from "typewriter-effect";

const nicknames = [
  "ekologický šofér",
  "pomocník",
  "ohľaduplný šofér",
  "bezpečný šofér",
  "spoľahlivý šofér",
];

const Header = ({ username, phase, onSyncClick: handleClick, syncing }) => {
  const [session] = useSession();
  const strIdx = useRef(Math.floor(Math.random() * nicknames.length));

  const profileImage = `${session.user.image}?field=image`;
  const profileName = session.user.name.split(" ")[0];

  return (
    <div className="bg-white shadow">
      <div className="px-4 sm:px-6 lg:max-w-6xl lg:mx-auto lg:px-8">
        <div className="py-6 md:flex md:items-center md:justify-between lg:border-t lg:border-gray-200">
          <div className="flex-1 min-w-0">
            <div className="flex items-center">
              <img
                className="hidden w-16 h-16 rounded-full sm:block"
                src={profileImage}
                alt=""
              />
              <div>
                <div className="flex items-center">
                  <img
                    className="w-16 h-16 rounded-full sm:hidden"
                    src={profileImage}
                    alt=""
                  />
                  <h1 className="ml-3 text-2xl font-bold leading-7 text-gray-900 sm:leading-9 sm:truncate">
                    <span className="inline-block">
                      <Typewriter
                        options={{
                          delay: 50,
                          deleteSpeed: 30,
                        }}
                        onInit={(typewriter) => {
                          typewriter
                            .typeString("Ahojte")
                            .pauseFor(500)
                            .typeString(",")
                            .pauseFor(500)
                            .typeString(" ")
                            .pauseFor(500)
                            .typeString(profileName)
                            .pauseFor(15000)
                            .deleteChars(profileName.length)
                            .typeString(nicknames[strIdx.current])
                            .pauseFor(15000)
                            .deleteChars(nicknames[strIdx.current].length)
                            .typeString(username)
                            .pauseFor(15000)
                            .deleteChars(username.length)
                            .typeString(profileName)
                            .start();
                        }}
                      />
                    </span>
                  </h1>
                </div>
                <dl className="flex flex-col mt-6 sm:ml-3 sm:mt-1 sm:flex-row sm:flex-wrap">
                  <dt className="sr-only">Aktuálna fáza</dt>
                  <dd className="flex items-center text-sm font-medium text-gray-500 sm:mr-6">
                    <svg
                      className="flex-shrink-0 mr-1.5 h-5 w-5 text-green-400"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Nachádzate sa vo fáze{" "}
                    <span className="mt-px mx-1 inline-flex items-center px-2.5 py-0.5 rounded-full text-md font-medium bg-gray-50 text-gray-500">
                      č. {phase?.number}
                    </span>
                  </dd>
                  <dt className="sr-only">Termín trvania aktuálnej fázy</dt>
                  <dd className="flex items-center mt-3 text-sm font-medium text-gray-500 sm:mt-0 sm:mr-6">
                    <svg
                      className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    <span className="mt-px mx-1 inline-flex items-center px-2.5 py-0.5 rounded-full text-md font-medium bg-gray-50 text-gray-500">
                      {phase && (
                        <Moment date={phase.startDate} format="DD. MM. YYYY" />
                      )}
                      <span className="px-1">-</span>
                      {phase && (
                        <Moment date={phase.endDate} format="DD. MM. YYYY" />
                      )}
                    </span>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="flex mt-6 space-x-3 md:mt-0 md:ml-4">
            <SyncButton onSyncClick={handleClick} syncing={syncing} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
