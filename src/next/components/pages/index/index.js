import React from "react";
import { useQuery } from "@apollo/client";
import Navigation from "../../common/Navigation";
import { useSession } from "next-auth/client";
import PhaseAPI from "../../../lib/api/phase";
import Spinner from "../../common/Spinner";
import RecommendationsAPI from "../../../lib/api/recommendations";
import UsersAPI from "../../../lib/api/users";
import Strategies from "./strategies/";
import Header from "./Header";
import Stats from "./Stats";
import History from "./History";

const IndexPageComponent = () => {
  const [session] = useSession();

  const { loading: phaseLoading, error: phaseError, data: phase } = useQuery(
    PhaseAPI.only
  );

  const {
    loading: recommendationLoading,
    error: recommendationError,
    data: recommendation,
  } = useQuery(RecommendationsAPI.random);

  console.log(recommendationError);

  const { loading: userLoading, error: userError, data: user } = useQuery(
    UsersAPI.bySession,
    {
      variables: { userId: session.id },
    }
  );

  // const { loading: setupLoading, error: setupError, data: setup } = useQuery(
  //   SetupsAPI.bySession,
  //   {
  //     variables: { setupId: user?.user.setup.id },
  //   }
  // );

  return (
    <Spinner
      dependencies={[phaseLoading, recommendationLoading, userLoading]}
      errors={[phaseError, recommendationError, userError]}
    >
      <div className="h-screen flex overflow-hidden bg-gray-100">
        <div className="flex-1 overflow-auto focus:outline-none" tabIndex="0">
          <Navigation />
          <main className="flex-1 relative pb-8 z-0 overflow-y-auto">
            <Header phase={phase} user={session.user} />
            <Strategies
              user={user}
              phase={phase}
              recommendation={recommendation}
            />
            <Stats />
            <History user={user} phase={phase} />
          </main>
        </div>
      </div>
    </Spinner>
  );
};

export default IndexPageComponent;
