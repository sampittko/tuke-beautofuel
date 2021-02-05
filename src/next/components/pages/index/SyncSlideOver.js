import { useMutation } from "@apollo/client";
import { useSession } from "next-auth/client";
import SynchronizationsAPI from "../../../lib/api/synchronizations";
import React, { useEffect, useState } from "react";

const SyncSlideOver = ({
  open,
  onClose: handleClose,
  onSyncCreated: handleSyncCreated,
  onSyncError: handleSyncError,
}) => {
  const [session] = useSession();
  const [syncToken, setSyncToken] = useState("");

  const [createSynchronization, { loading, data }] = useMutation(
    SynchronizationsAPI.create,
    {
      context: {
        headers: {
          authorization: `Bearer ${session.jwt}`,
          "X-Token": syncToken,
        },
      },
      onError: handleSyncError,
    }
  );

  useEffect(() => {
    if (data) {
      handleSyncCreated(data.createSynchronization.synchronization.id);
    }
  }, [data]);

  const handleSubmit = (e) => {
    e.preventDefault();
    createSynchronization();
    handleClose();
    setSyncToken("");
  };

  return (
    <div
      className={`${!open ? "hidden" : ""} fixed inset-0 overflow-hidden z-10`}
    >
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="absolute top-0 left-0 w-screen h-screen bg-black opacity-60"
          onClick={handleClose}
        />
        <section
          className="absolute inset-y-0 right-0 flex max-w-full"
          aria-labelledby="slide-over-heading"
        >
          <div className="w-screen max-w-md">
            <form
              className="flex flex-col h-full bg-white divide-y divide-gray-200 shadow-xl"
              onSubmit={handleSubmit}
            >
              <div className="flex-1 h-0 overflow-y-auto">
                <div className="px-4 py-6 bg-green-700 sm:px-6">
                  <div className="flex items-center justify-between">
                    <h2
                      id="slide-over-heading"
                      className="text-lg font-medium text-white"
                    >
                      Nová synchronizácia jázd
                    </h2>
                  </div>
                  <div className="mt-1">
                    <p className="text-sm text-green-300">
                      Vykonaním tejto synchronizácie sa naimportujú chýbajúce
                      jazdy z enviroCar a aktualizujú Vaše štatistiky
                    </p>
                  </div>
                </div>
                <div className="flex flex-col justify-between flex-1">
                  <div className="px-4 divide-y divide-gray-200 sm:px-6">
                    <div className="pt-6 pb-5 space-y-6">
                      <div>
                        <label
                          htmlFor="envirocar-password"
                          className="block text-sm font-medium text-gray-900"
                        >
                          Heslo na{" "}
                          <span className="text-green-600">enviroCar</span>{" "}
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                            Povinné
                          </span>
                        </label>
                        <div className="mt-1">
                          <input
                            required
                            onChange={(e) => setSyncToken(e.target.value)}
                            value={syncToken}
                            type="password"
                            name="envirocar-password"
                            id="envirocar-password"
                            className="block w-full border-gray-300 rounded-md shadow-sm sm:text-sm focus:ring-green-500 focus:border-green-500"
                          />
                        </div>
                      </div>
                      <fieldset className="opacity-60 hover:cursor-default">
                        <legend className="text-sm font-medium text-gray-900">
                          Uloženie hesla{" "}
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                            Nedostupná funkcia
                          </span>
                        </legend>
                        <div className="mt-2 space-y-5">
                          <div className="relative flex items-start">
                            <div className="absolute flex items-center h-5">
                              <input
                                disabled
                                id="save-password"
                                name="save-password"
                                aria-describedby="save-password_description"
                                type="radio"
                                className="w-4 h-4 text-green-600 border-gray-300 focus:ring-green-500"
                              />
                            </div>
                            <div className="text-sm pl-7">
                              <label
                                htmlFor="save-password"
                                className="font-medium text-gray-900"
                              >
                                Uložiť
                              </label>
                              <p
                                id="save-password_description"
                                className="text-gray-500"
                              >
                                Heslo nebudete musieť zadávať kým ho nezmeníte
                                na službe enviroCar
                              </p>
                            </div>
                          </div>
                          <div>
                            <div className="relative flex items-start">
                              <div className="absolute flex items-center h-5">
                                <input
                                  disabled
                                  id="forget-password"
                                  name="forget-password"
                                  aria-describedby="forget-password_description"
                                  type="radio"
                                  className="w-4 h-4 text-green-600 border-gray-300 focus:ring-green-500"
                                  checked
                                />
                              </div>
                              <div className="text-sm pl-7">
                                <label
                                  htmlFor="forget-password"
                                  className="font-medium text-gray-900"
                                >
                                  Neukladať
                                </label>
                                <p
                                  id="forget-password_description"
                                  className="text-gray-500"
                                >
                                  Heslo budete musieť zadávať manuálne pri
                                  vykonaní každej novej synchronizácie
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </fieldset>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex justify-end flex-shrink-0 px-4 py-4">
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  Zrušiť
                </button>
                <button
                  disabled={loading || !syncToken}
                  type="submit"
                  className={`ml-4 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 ${
                    loading || !syncToken
                      ? "opacity-60 hover:cursor-default"
                      : "hover:bg-green-700"
                  }`}
                >
                  Synchronizovať
                </button>
              </div>
            </form>
          </div>
        </section>
      </div>
    </div>
  );
};

export default SyncSlideOver;
