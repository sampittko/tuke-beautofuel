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
import UsersAPI from "../../../lib/api/users";

const Top10PageComponent = () => {
  const [session] = useSession();
  const [drivers, setDrivers] = useState([]);

  const {
    loading: phaseLoading,
    error: phaseError,
    data: phaseData,
  } = useQuery(PhaseAPI.only);

  const {
    loading: tracksLoading,
    error: tracksError,
    data: tracksData,
  } = useQuery(TracksAPI.top10, {
    variables: {
      phaseNumber: phaseData?.phase.number,
    },
    skip: !phaseData,
  });

  const { data: usersData } = useQuery(UsersAPI.allUsernamesByStrategy);

  useEffect(() => {
    if (tracksData && usersData) {
      const allUsernamesByStrategy = usersData;
      const driversWithTracksObject = _.chain(tracksData.tracks)
        .groupBy("user.username")
        .map((value, key) => ({
          username: key,
          score: value[0].user.wallet[`credits${phaseData.phase.number}`],
          duration: _.sumBy(value, "duration"),
          distance: _.sumBy(value, "totalDistance"),
        }))
        .keyBy("username")
        .value();

      const allUsernames = [
        ...allUsernamesByStrategy.gamificationUsernames,
        ...allUsernamesByStrategy.rewardsUsernames,
      ];

      allUsernames.forEach((driver) => {
        if (!driversWithTracksObject[`${driver.username}`]) {
          driversWithTracksObject[`${driver.username}`] = {
            username: driver.username,
            score: 0,
            distance: 0,
            duration: 0,
          };
        }
      });

      const newDrivers = [];

      _.forOwn(driversWithTracksObject, (value) => {
        newDrivers.push(value);
      });

      setDrivers(newDrivers);
    }
  }, [tracksData, usersData]);

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
            <Stats phaseNumber={phaseData?.phase.number} drivers={drivers} />
          </div>
        </main>
      </div>
    </Spinner>
  );
};

export default Top10PageComponent;
