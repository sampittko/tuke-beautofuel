import React, { useEffect, useState } from "react";

const StepThree = ({
  onSubmit,
  onSuccess,
  loading: setupCompletedLoading,
  error: setupCompletedError,
  data: setupFinishedData,
}) => {
  const [accepted, setAccepted] = useState(false);
  const [status, setStatus] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit();
  };

  useEffect(() => {
    if (!setupCompletedError && setupFinishedData) {
      onSuccess();
    } else {
      if (setupCompletedError) {
        setStatus("Nastala chyba pri ukladaní, skúste znovu");
      }
    }
  }, [setupCompletedError, setupFinishedData]);

  const submitDisabled = !accepted || setupCompletedLoading;

  return (
    <div className="px-4 py-16 overflow-hidden bg-white sm:px-6 lg:px-8 lg:py-24">
      <div className="relative max-w-xl mx-auto">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            Zber dát
          </h2>
          <p className="mt-4 text-lg leading-6 text-left text-gray-500">
            Pre úspešnú realizáciu a vyhodnotenie experimentu je nevyhnutné
            zhromaždiť všetky dáta, ktoré vyzbierate pomocou aplikácie enviroCar
            a zaznamenávať akcie, ktoré v systéme pre experiment vykonávate.
          </p>
          <p className="mt-4 text-lg leading-6 text-left text-gray-500">
            Dokončením týchto úvodných nastavení sa stávate platným účastníkom
            experimentu a ste povinný sa riadiť inštrukciami, ktoré Vám boli
            poskytnuté organizátorom experimentu.
          </p>
          <p className="mt-4 text-lg leading-6 text-left text-gray-500">
            Organizátor experimentu si vyhradzuje právo:
            <ul className="list-disc list-inside">
              <li>
                Pozmeniť inštrukcie prislúchajúce práve prebiehajúcej fáze
                experimentu,
              </li>
              <li>
                celkovo zrušiť experiment, ak to uzná za vhodné vzhľadom na
                vzniknuté okolnosti a
              </li>
              <li>tiež kedykoľvek Vás vylúčiť z experimentu.</li>
            </ul>
          </p>
          <p className="mt-4 text-lg leading-6 text-left text-gray-500">
            Organizátor experimentu si vyhradzuje právo aj:
            <ul className="list-disc list-inside">
              <li>Nezohľadniť Vaše dáta pri vyhodnotení experimentu,</li>
              <li>
                dodať Vám odmeny, ktoré mohli byť počas experimentu nadobudnuté,
                až keď bude situácia ohľadom vírusu COVID-19 prijateľná,
              </li>
              <li>zmeniť podmienky pre získanie odmien,</li>
              <li>kedykoľvek upraviť pomer ekologického výkonu ku odmenám a</li>
              <li>
                kedykoľvek zmeniť algoritmus pre výpočet ekologického výkonu.
              </li>
            </ul>
          </p>
          <p className="mt-4 text-lg leading-6 text-left text-gray-500">
            Systém o Vás zbiera nasledujúce dáta:
            <ul className="list-disc list-inside">
              <li>
                Po vykonaní synchronizácie dát v tomto systéme všetky dáta,
                ktoré poskytnete službe enviroCar (jedná sa hlavne o GPS
                súradnice s podrobnosťami o aktuálnej spotrebe, emisiách a typ
                automobilu s jeho detailmi - rok výroby, objem motora, typ
                spaľovania a konkrétny model značky) a
              </li>
              <li>
                všetky akcie, ktoré budete v tomto systéme vykonávať vrátane
                času, kedy dané akcie vykonávate (jedná sa hlavne o
                synchronizáciu dát so službou enviroCar, nákup alebo predaj
                odmien a kedy ste sa naposledy prihlásili).
              </li>
            </ul>
          </p>
        </div>

        <div className="mt-8">
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-8"
          >
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
                    Bol som upovedomený o zhromažďovaných dátach a súhlasím s
                    ich sprostredkovaním organizátorovi experimentu pre účely
                    uskutočnenia a vyhodnotenia experimentu{" "}
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                      Povinné
                    </span>
                  </p>
                </div>
              </div>
            </div>

            <div className="sm:col-span-2">
              <button
                disabled={submitDisabled}
                type="submit"
                className={`w-full inline-flex items-center justify-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-green-600  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 ${
                  !submitDisabled
                    ? "hover:bg-green-700"
                    : "hover:cursor-default opacity-60"
                }`}
              >
                Dokončiť a začať
              </button>
              <div className="w-full mt-2 text-center">
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

export default StepThree;
