import { useSession } from "next-auth/client";
import React, { useEffect, useState } from "react";
import { formatDistance, formatDuration } from "../../../utils/functions";
// import Moment from "react-moment";

const Stats = ({ phaseNumber, tracks, drivers }) => {
  const [session] = useSession();

  const [totalDistance, setTotalDistance] = useState(0);
  const [totalDuration, setTotalDuration] = useState(0);

  useEffect(() => {
    setTotalDuration(_.sumBy(drivers, "duration"));
    setTotalDistance(_.sumBy(drivers, "distance"));
  }, [tracks]);

  return (
    <div className="py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Celkové štatistiky
          </h2>
          <p className="mt-3 text-xl text-gray-500 sm:mt-4">
            {session
              ? `Váš výkon s výkonmi ostatných v číslach počas súčasnej fázy experimentu č. ${phaseNumber}`
              : "Po dobu 2 týždňov medzi sebou účastníci experimentu súťažia v ekologickej jazde automobilom"}
          </p>
        </div>
      </div>
      <div className="mt-10">
        <div className="relative">
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <dl className="rounded-lg bg-white shadow-lg sm:grid sm:grid-cols-3">
                <div className="flex flex-col border-b border-gray-100 p-6 text-center sm:border-0 sm:border-r">
                  <dt className="order-2 mt-2 text-lg leading-6 font-medium text-gray-500">
                    Spolu najazdené
                  </dt>
                  <dd className="order-1 text-5xl font-extrabold text-green-600">
                    {formatDistance(totalDistance)}
                  </dd>
                </div>
                <div className="flex flex-col border-t border-b border-gray-100 p-6 text-center sm:border-0 sm:border-l sm:border-r">
                  <dt className="order-2 mt-2 text-lg leading-6 font-medium text-gray-500">
                    Celkový čas za volantom
                  </dt>
                  <dd className="order-1 text-5xl font-extrabold text-green-600">
                    {/* <Moment format="HH:mm">{totalDuration}</Moment> hod. */}
                    {formatDuration(totalDuration)}
                  </dd>
                </div>
                <div className="flex flex-col border-t border-gray-100 p-6 text-center sm:border-0 sm:border-l">
                  <dt className="order-2 mt-2 text-lg leading-6 font-medium text-gray-500">
                    Počet zapojených šoférov
                  </dt>
                  <dd className="order-1 text-5xl font-extrabold text-green-600">
                    {drivers.length}
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
