import React, { useState } from "react";
import { NetworkStatus, useQuery } from "@apollo/client";
import Navigation from "../../common/Navigation";
import { useSession } from "next-auth/client";
import PhaseAPI from "../../../lib/api/phase";
import Spinner from "../../common/Spinner";
import RecommendationsAPI from "../../../lib/api/recommendations";
import UsersAPI from "../../../lib/api/users";
import Strategies from "./strategies/";
import Header from "./header/";
import Stats from "./Stats";
import History from "./History";
import SyncSlideOver from "./SyncSlideOver";
import SyncNotification from "./SyncNotification";
import Skeleton from "./Skeleton";
import TracksAPI from "../../../lib/api/tracks";

const IndexPageComponent = () => {
  const [session] = useSession();
  const [syncing, setSyncing] = useState(false);
  const [syncSlideOverOpen, setSyncSlideOverOpen] = useState(false);
  const [syncNotificationVisible, setSyncNotificationVisible] = useState(false);
  const [syncError, setSyncError] = useState(false);

  const {
    loading: phaseLoading,
    error: phaseError,
    data: phaseData,
  } = useQuery(PhaseAPI.only);

  const {
    loading: recommendationLoading,
    error: recommendationError,
    data: recommendation,
  } = useQuery(RecommendationsAPI.random);

  const { loading: userLoading, error: userError, data: userData } = useQuery(
    UsersAPI.bySession,
    {
      variables: { userId: session.id },
    }
  );

  const {
    loading: tracksLoading,
    error: tracksError,
    data: tracksData,
    refetch: tracksRefetch,
    networkStatus: tracksNetworkStatus,
  } = useQuery(TracksAPI.bySession, {
    variables: { userId: session.id },
    notifyOnNetworkStatusChange: true,
  });

  const handleSlideOverOpen = () => {
    setSyncSlideOverOpen(true);
  };

  const handleSlideOverClose = () => {
    setSyncSlideOverOpen(false);
  };

  console.log(tracksNetworkStatus === NetworkStatus.refetch);

  const handleSyncToggle = (loading, mutationSuccessful) => {
    if (loading) {
      setSyncing(true);
      setTimeout(() => {
        setSyncing(false);
        tracksRefetch();
        setSyncNotificationVisible(true);
        setTimeout(() => {
          setSyncNotificationVisible(false);
          setTimeout(() => {
            setSyncError(false);
          }, 100);
        }, 4000);
      }, 3000);
    } else {
      if (!mutationSuccessful) {
        setSyncError(true);
      }
    }
  };

  return (
    <Spinner
      dependencies={[
        phaseLoading,
        recommendationLoading,
        userLoading,
        tracksLoading,
      ]}
      errors={[phaseError, recommendationError, userError, tracksError]}
    >
      <div className="h-screen flex overflow-hidden bg-gray-100 z-0">
        <div className="flex-1 overflow-auto focus:outline-none" tabIndex="0">
          <Navigation />
          <main className="flex-1 relative pb-8 z-0 overflow-y-auto">
            <Header
              phase={phaseData?.phase}
              user={session.user}
              onSyncClick={handleSlideOverOpen}
              syncing={syncing}
            />
            <Skeleton visible={syncing}>
              <Strategies
                user={userData?.user}
                phase={phaseData?.phase}
                recommendation={recommendation}
              />
              <Stats tracks={tracksData?.tracks} />
              <History
                user={userData?.user}
                phase={phaseData?.phase}
                tracks={tracksData?.tracks}
              />
            </Skeleton>
          </main>
        </div>
      </div>
      <SyncSlideOver
        open={syncSlideOverOpen}
        onClose={handleSlideOverClose}
        onSyncToggle={handleSyncToggle}
      />
      <SyncNotification show={syncNotificationVisible} error={syncError} />
    </Spinner>
  );
};

export default IndexPageComponent;
