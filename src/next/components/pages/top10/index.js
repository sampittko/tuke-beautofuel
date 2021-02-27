import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/client";
import Navigation from "../../common/Navigation";
import Share from "./Share";
import Stats from "./Stats";
import Table from "./Table";
import Spinner from "../../common/Spinner";
import { useQuery } from "@apollo/client";
import PhaseAPI from "../../../lib/api/phase";
import UsersAPI from "../../../lib/api/users";
import Redirects from "../../common/Redirects";
import { USER_GROUPS } from "../../../utils/constants";
import { getApiUrl } from "../../../utils/functions";
import axios from "axios";

const Top10PageComponent = () => {
  const [session] = useSession();

  // last minute refactoring
  const [top10, setTop10] = useState(null);
  const [top10Loading, setTop10Loading] = useState(false);
  const [top10Error, setTop10Error] = useState(null);

  // last minute refactoring
  const [top10Stats, setTop10Stats] = useState(null);
  const [top10StatsLoading, setTop10StatsLoading] = useState(false);
  const [top10StatsError, setTop10StatsError] = useState(null);

  const {
    loading: phaseLoading,
    error: phaseError,
    data: phaseData,
  } = useQuery(PhaseAPI.only);

  const { data: userData } = useQuery(UsersAPI.bySession, {
    skip: !session,
    variables: { userId: session?.id },
  });

  useEffect(() => {
    setTop10Error(null);
    setTop10Loading(true);
    axios
      .get(`${getApiUrl()}/tracks/top10`)
      .then((res) => {
        setTop10(res.data);
      })
      .catch((err) => {
        setTop10Error(err);
      })
      .finally(() => {
        setTop10Loading(false);
      });
  }, []);

  useEffect(() => {
    setTop10StatsError(null);
    setTop10StatsLoading(true);
    axios
      .get(`${getApiUrl()}/tracks/top10/stats`)
      .then((res) => {
        setTop10Stats(res.data);
      })
      .catch((err) => {
        setTop10StatsError(err);
      })
      .finally(() => {
        setTop10StatsLoading(false);
      });
  }, []);

  if (
    phaseData?.phase.number === 1 ||
    (phaseData?.phase.number === 2 &&
      userData?.user.group === USER_GROUPS.rewards)
  ) {
    return <Redirects toDashboard replace />;
  }

  return (
    <Spinner
      dependencies={[phaseLoading, top10Loading, top10StatsLoading]}
      errors={[phaseError, top10Error, top10StatsError]}
    >
      <div className="min-h-screen bg-gray-100">
        <Navigation />
        <main>
          <Table top10={top10} />
          {session && <Share />}
          <Stats phaseNumber={phaseData?.phase.number} stats={top10Stats} />
        </main>
      </div>
    </Spinner>
  );
};

export default Top10PageComponent;
