import { useSession } from "next-auth/client";
import React from "react";
import { formatDistance, formatConsumption } from "../../../utils/functions";

const Stats = ({ phaseNumber, stats }) => {
  const [session] = useSession();

  if (!stats) {
    return null;
  }

  return (
    <div className="py-32">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Celkové štatistiky
          </h2>
          <p className="mt-3 text-xl text-gray-500 sm:mt-4">
            {session
              ? `Váš výkon s výkonmi ostatných v číslach počas aktuálnej fázy experimentu č. ${phaseNumber}`
              : "Po dobu 2 týždňov medzi sebou účastníci experimentu súťažia v ekologickej jazde automobilom"}
          </p>
        </div>
      </div>
      <div className="mt-10">
        <div className="relative">
          <div className="relative px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <dl className="bg-white rounded-lg shadow-lg lg:grid lg:grid-cols-2">
                <div className="flex flex-col p-6 text-center border-b border-gray-100 sm:border-0 sm:border-r">
                  <dt className="order-2 mt-2 text-lg font-medium leading-6 text-gray-500">
                    Spolu najazdené
                  </dt>
                  <dd className="order-1 text-5xl font-extrabold text-green-600">
                    {formatDistance(parseFloat(stats.distance))}
                  </dd>
                </div>
                <div className="flex flex-col p-6 text-center border-t border-gray-100 sm:border-0 sm:border-l">
                  <dt className="order-2 mt-2 text-lg font-medium leading-6 text-gray-500">
                    Priemerné ekologické skóre
                  </dt>
                  <dd className="order-1 text-5xl font-extrabold text-green-600">
                    {stats.score}
                  </dd>
                </div>
                <div className="flex flex-col p-6 text-center border-t border-b border-gray-100 sm:border-0 sm:border-l sm:border-r">
                  <dt className="order-2 mt-2 text-lg font-medium leading-6 text-gray-500">
                    Spotrebované množstvo paliva
                  </dt>
                  <dd className="order-1 text-5xl font-extrabold text-green-600">
                    {formatConsumption(parseFloat(stats.fuelConsumed))}
                  </dd>
                </div>
                <div className="flex flex-col p-6 text-center border-t border-b border-gray-100 sm:border-0 sm:border-l sm:border-r">
                  <dt className="order-2 mt-2 text-lg font-medium leading-6 text-gray-500">
                    Celkový čas za volantom
                  </dt>
                  <dd className="order-1 text-5xl font-extrabold text-green-600">
                    {stats.duration}
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Stats;
