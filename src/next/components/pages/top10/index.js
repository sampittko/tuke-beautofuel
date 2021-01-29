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
import Redirects from "../../common/Redirects";
import { USER_GROUPS } from "../../../utils/constants";

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
    pollInterval: 30000,
  });

  const { data: userData } = useQuery(UsersAPI.bySession, {
    skip: !session,
    variables: { userId: session?.id },
  });

  const { data: usersData } = useQuery(UsersAPI.allUsernamesByStrategy);

  useEffect(() => {
    if (tracksData && usersData) {
      const allUsernamesByStrategy = usersData;
      const driversWithTracksObject = _.chain(tracksData.tracks)
        .groupBy("user.username")
        .map((track, key) => ({
          username: key,
          id: track[0].user.id,
          score: track[0].user.wallet[`score${phaseData.phase.number}`],
          duration: _.sumBy(track, "duration"),
          distance: _.sumBy(track, "totalDistance"),
          group: track[0].user.group,
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
            id: driver.id,
            username: driver.username,
            score: 0,
            distance: 0,
            duration: 0,
            group: driver.group,
          };
        }
      });

      const newDrivers = [];

      _.forOwn(driversWithTracksObject, (value) => {
        if (
          phaseData.phase.number === 3 ||
          value.group !== USER_GROUPS.rewards
        ) {
          newDrivers.push(value);
        }
      });

      setDrivers(newDrivers);
    }
  }, [tracksData, usersData]);

  if (
    phaseData?.phase.number === 1 ||
    (phaseData?.phase.number === 2 &&
      userData?.user.group === USER_GROUPS.rewards)
  ) {
    return <Redirects toDashboard replace />;
  }

  return (
    <Spinner
      dependencies={[phaseLoading, tracksLoading]}
      errors={[phaseError, tracksError]}
    >
      <div className="min-h-screen bg-gray-100">
        <Navigation />
        <main>
          <Table drivers={drivers} />
          {session && <Share />}
          <Stats phaseNumber={phaseData?.phase.number} drivers={drivers} />
        </main>
      </div>
    </Spinner>
  );
};

export default Top10PageComponent;
