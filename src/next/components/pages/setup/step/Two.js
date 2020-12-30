import axios from "axios";
import { useSession } from "next-auth/client";
import React, { useState } from "react";
import { getApiUrl } from "../../../../utils/functions";

const StepTwo = ({
  envirocar,
  onEnvirocarChange: handleEnvirocarChange,
  onSubmit,
}) => {
  const [session] = useSession();
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState(
    "Overte svoj enviroCar účet skôr než budete pokračovať"
  );
  const [verified, setVerified] = useState(false);
  const [verifying, setVerifying] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit();
  };

  const handleVerification = (e) => {
    e.preventDefault();
    setVerifying(true);
    axios
      .get(`${getApiUrl()}/envirocar`, {
        headers: {
          authorization: `Bearer ${session.jwt}`,
          "X-User": envirocar,
          "X-Token": password,
        },
      })
      .then(() => {
        setStatus("Overenie účtu prebehlo úspešne");
        setVerified(true);
      })
      .catch(() => {
        setStatus("Skontrolujte svoje prihlasovacie údaje a skúste znovu");
      })
      .finally(() => {
        setVerifying(false);
        setPassword("");
      });
  };

  return (
    <div className="bg-white py-16 px-4 overflow-hidden sm:px-6 lg:px-8 lg:py-24">
      <div className="relative max-w-xl mx-auto">
        <div className="text-center">
          <a href="https://envirocar.org" target="_blank">
            <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              enviroCar{" "}
              <svg
                className="ml-2 -mr-0.5 h-6 w-6 inline"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z"></path>
                <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z"></path>
              </svg>
            </h2>
          </a>
          <p className="text-left mt-4 text-lg leading-6 text-gray-500">
            V experimente sa používa mobilná aplikácia služby enviroCar za
            účelom zberu dát z jazdy automobilom.
          </p>
          <p className="text-left mt-4 text-lg leading-6 text-gray-500">
            Po kliknutí na{" "}
            <a
              href="https://envirocar.org"
              target="_blank"
              className="text-green-600 underline hover:no-underline font-semibold"
            >
              tento odkaz
            </a>{" "}
            budete presmerovaný na stránku služby, kde sa potrebujete
            registrovať. Po úspešnej registrácii sa vráťte a zadajte
            prihlasovacie údaje do políčok nižšie pre overenie existencie Vášho
            enviroCar účtu. Po úspešnom zadaní údajov môžete pokračovať na ďalší
            krok.
          </p>
          <p className="text-left mt-4 text-lg leading-6 text-gray-500">
            V systéme sa uloží <span className="font-semibold">len</span> Vaše
            enviroCar <span className="underline">prihlasovacie meno</span>.
            Heslo je potrebné zadávať manuálne pri každej synchronizácii dát a
            je použité <span className="font-semibold">len</span> pre účely{" "}
            <span className="underline">synchronizácie dát</span>. Toto heslo sa{" "}
            <span className="font-semibold">nikdy neuloží</span> v tomto systéme
            a po synchronizácii je hneď zabudnuté.
          </p>
        </div>
        <div className="mt-8">
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-8"
          >
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-700"
              >
                enviroCar meno{" "}
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                  Povinné
                </span>
              </label>
              <div className="mt-1">
                <input
                  required
                  disabled={verified}
                  value={envirocar}
                  onChange={(e) => handleEnvirocarChange(e.target.value)}
                  type="text"
                  name="username"
                  id="username"
                  autoComplete="username"
                  className="py-3 px-4 block w-full shadow-sm border-gray-300 rounded-md"
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                enviroCar heslo{" "}
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                  Povinné
                </span>
              </label>
              <div className="mt-1">
                <input
                  required
                  disabled={verified}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type="password"
                  name="password"
                  id="password"
                  autoComplete="password"
                  className="py-3 px-4 block w-full shadow-sm border-gray-300 rounded-md"
                />
              </div>
            </div>

            <div className="sm:col-span-2">
              <button
                onClick={handleVerification}
                disabled={verifying || verified}
                type="button"
                className={`w-full inline-flex items-center justify-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-gray-600  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 ${
                  verifying || verified
                    ? "opacity-60 hover:cursor-default"
                    : "hover:bg-gray-700"
                }`}
              >
                Overiť účet
              </button>
            </div>

            <div className="sm:col-span-2">
              <button
                disabled={!verified}
                type="submit"
                className={`w-full inline-flex items-center justify-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-green-600  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 ${
                  verified
                    ? "hover:bg-green-700"
                    : "hover:cursor-default opacity-60"
                }`}
              >
                Uložiť <span className="underline px-1">enviroCar meno </span> a
                prejsť na ďalší krok
              </button>
              <div className="mt-2 text-center w-full">
                {status && (
                  <span className="text-xs text-gray-500">{status}</span>
                )}
                {!status && <div className="h-6" />}
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default StepTwo;
