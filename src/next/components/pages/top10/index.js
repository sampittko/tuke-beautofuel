import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/client";
import Navigation from "../../common/Navigation";
import Share from "./Share";
import Stats from "./Stats";
import Table from "./Table";
import Spinner from "../../common/Spinner";
import { useQuery } from "@apollo/client";
import PhaseAPI from "../../../lib/api/phase";
import TracksAPI from "../../../lib/api/tracks";
import _ from "lodash";

const Top10PageComponent = () => {
  const [session] = useSession();
  const [drivers, setDrivers] = useState([]);

  const { loading: phaseLoading, error: phaseError, data: phase } = useQuery(
    PhaseAPI.only
  );

  const { loading: tracksLoading, error: tracksError, data: tracks } = useQuery(
    TracksAPI.top10
  );

  useEffect(() => {
    if (tracks) {
      const newDrivers = _.chain(tracks.tracks)
        .groupBy("user.username")
        .map((value, key) => ({
          username: key,
          score: value[0].user.wallet.credits,
          duration: _.sumBy(value, "duration"),
          distance: _.sumBy(value, "totalDistance"),
        }))
        .value();
      setDrivers(newDrivers);
    }
  }, [tracks]);

  return (
    <Spinner
      dependencies={[phaseLoading, tracksLoading]}
      errors={[phaseError, tracksError]}
    >
      <div className="min-h-screen bg-gray-100">
        <Navigation />

        <div className="bg-green-600 pb-32">
          <header className="py-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <h1 className="text-center uppercase text-3xl font-bold text-white">
                Sieň slávy
              </h1>
            </div>
          </header>
        </div>

        <main className="-mt-32">
          <div className="max-w-7xl mx-auto pb-12 px-4 sm:px-6 lg:px-8">
            <Table drivers={drivers} />
            {session && <Share />}
            <Stats phaseNumber={phase?.phase.number} drivers={drivers} />
          </div>
        </main>
      </div>
    </Spinner>
  );
};

export default Top10PageComponent;
