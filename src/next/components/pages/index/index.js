import React, { useState } from "react";
import { useQuery } from "@apollo/client";
import Navigation from "../../common/Navigation";
import { useSession } from "next-auth/client";
import PhaseAPI from "../../../lib/api/phase";
import Spinner from "../../common/Spinner";
import RecommendationsAPI from "../../../lib/api/recommendations";
import UsersAPI from "../../../lib/api/users";
import Strategies from "./strategies/";
import Header from "./header/Header";
import Stats from "./Stats";
import History from "./History";
import SyncSlideOver from "./SyncSlideOver";
import SyncNotification from "./SyncNotification";

const IndexPageComponent = () => {
  const [session] = useSession();
  const [syncing, setSyncing] = useState(false);
  const [syncSlideOverOpen, setSyncSlideOverOpen] = useState(false);
  const [syncNotificationVisible, setSyncNotificationVisible] = useState(false);

  const { loading: phaseLoading, error: phaseError, data: phase } = useQuery(
    PhaseAPI.only
  );

  const {
    loading: recommendationLoading,
    error: recommendationError,
    data: recommendation,
  } = useQuery(RecommendationsAPI.random);

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

  const handleSlideOverOpen = () => {
    setSyncSlideOverOpen(true);
  };

  const handleSlideOverClose = () => {
    setSyncSlideOverOpen(false);
  };

  const handleSyncToggle = (loading) => {
    if (loading) {
      setSyncing(true);
      setTimeout(() => {
        setSyncing(false);
        setSyncNotificationVisible(true);
        setTimeout(() => {
          setSyncNotificationVisible(false);
        }, 3000);
      }, 3000);
    }
  };

  return (
    <Spinner
      dependencies={[phaseLoading, recommendationLoading, userLoading]}
      errors={[phaseError, recommendationError, userError]}
    >
      <div className="h-screen flex overflow-hidden bg-gray-100 z-0">
        <div className="flex-1 overflow-auto focus:outline-none" tabIndex="0">
          <Navigation />
          <main className="flex-1 relative pb-8 z-0 overflow-y-auto">
            <Header
              phase={phase}
              user={session.user}
              onSyncClick={handleSlideOverOpen}
              syncing={syncing}
            />
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
      <SyncSlideOver
        open={syncSlideOverOpen}
        onClose={handleSlideOverClose}
        onSyncToggle={handleSyncToggle}
      />
      <SyncNotification show={syncNotificationVisible} />
    </Spinner>
  );
};

export default IndexPageComponent;
