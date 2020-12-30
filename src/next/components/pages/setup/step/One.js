import { useSession } from "next-auth/client";
import React, { useEffect, useState } from "react";

const StepOne = ({ username, setUsername, onSubmit: handleSubmit }) => {
  const [session] = useSession();
  const [accepted, setAccepted] = useState(false);
  const [placeholder, setPlaceholder] = useState("");
  const [usernameStatus, setUsernameStatus] = useState("");

  useEffect(() => {
    const emailAlias = session.user.email.split("@")[0];
    setPlaceholder(emailAlias.replaceAll(".", ""));
  }, []);

  const handleUsernameChange = (e) => {
    e.preventDefault();
    const newUsername = e.target.value;

    const validCharacters = newUsername.match(/^[a-zA-Z0-9]+$/);
    const validLength = newUsername.length <= 20;

    if ((validCharacters || newUsername === "") && validLength) {
      setUsername(newUsername);
      setUsernameStatus("");
      if (newUsername !== "" && newUsername.length >= 6) {
        setUsernameStatus("Táto prezývka je vhodná!");
      }
    } else {
      if (!validCharacters) {
        setUsernameStatus("Povolené sú len veľké a malé písmená s číslami");
      } else {
        if (!validLength) {
          setUsernameStatus("Maximálna dĺžka prezývky je 20 znakov");
        }
      }
    }
  };

  return (
    <div className="bg-white py-16 px-4 overflow-hidden sm:px-6 lg:px-8 lg:py-24">
      <div className="relative max-w-xl mx-auto">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            Základné údaje
          </h2>
        </div>
        <div className="mt-12">
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-8"
          >
            <div>
              <label
                htmlFor="first_name"
                className="block text-sm font-medium text-gray-700"
              >
                Meno{" "}
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                  Predvyplnené
                </span>
              </label>
              <div className="mt-1">
                <input
                  value={session.user.name.split(" ")[0]}
                  disabled
                  type="text"
                  name="first_name"
                  id="first_name"
                  autoComplete="given-name"
                  className="py-3 px-4 block w-full shadow-sm border-gray-300 rounded-md"
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="last_name"
                className="block text-sm font-medium text-gray-700"
              >
                Priezvisko{" "}
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                  Predvyplnené
                </span>
              </label>
              <div className="mt-1">
                <input
                  value={session.user.name.split(" ")[1]}
                  disabled
                  type="text"
                  name="last_name"
                  id="last_name"
                  autoComplete="family-name"
                  className="py-3 px-4 block w-full shadow-sm border-gray-300 rounded-md"
                />
              </div>
            </div>
            <div className="sm:col-span-2">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                E-mail{" "}
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                  Predvyplnené
                </span>
              </label>
              <div className="mt-1">
                <input
                  disabled
                  value={session.user.email}
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  className="py-3 px-4 block w-full shadow-sm border-gray-300 rounded-md"
                />
              </div>
            </div>
            <div className="sm:col-span-2">
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-700"
              >
                Prezývka šoféra{" "}
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                  Povinné
                </span>
              </label>
              <div className="mt-1">
                <input
                  required
                  value={username}
                  placeholder={`napr. ${placeholder}`}
                  onChange={handleUsernameChange}
                  id="username"
                  name="username"
                  type="text"
                  autoComplete="username"
                  className="py-3 px-4 block w-full shadow-sm focus:ring-green-500 focus:border-green-500 border-gray-300 rounded-md"
                />
              </div>
              <div className="mt-1">
                {usernameStatus && (
                  <span className="text-xs text-gray-500">
                    {usernameStatus}
                  </span>
                )}
                {!usernameStatus && <div className="h-6" />}
              </div>
            </div>

            <div className="sm:col-span-2">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <button
                    value={accepted}
                    onClick={() => setAccepted(!accepted)}
                    type="button"
                    aria-pressed={accepted}
                    className={`relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 ${
                      accepted ? "bg-green-600" : "bg-gray-200"
                    }`}
                  >
                    <span className="sr-only">
                      Súhlasím so zverejnením týchto informácií
                    </span>
                    <span
                      aria-hidden="true"
                      className={`inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200 ${
                        accepted ? "translate-x-5" : "translate-x-0"
                      }`}
                    ></span>
                  </button>
                </div>
                <div className="ml-3">
                  <p className="text-base text-gray-500">
                    Vyjadrujem súhlas s tým, že tieto informácie organizátor
                    experimentu použije výhradne pre účely jeho organizácie{" "}
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                      Povinné
                    </span>
                  </p>
                </div>
              </div>
            </div>
            <div className="sm:col-span-2">
              <button
                disabled={!accepted || !username}
                type="submit"
                className={`w-full inline-flex items-center justify-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-green-600  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 ${
                  accepted && username.length >= 6
                    ? "hover:bg-green-700"
                    : "hover:cursor-default opacity-60"
                }`}
              >
                Ďalší krok
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default StepOne;
