import React, { useEffect, useState } from "react";
import { useQuery } from "@apollo/client";
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
import SynchronizationsAPI from "../../../lib/api/synchronizations";
import { SYNCHRONIZATION_STATUSES } from "../../../utils/constants";

const IndexPageComponent = () => {
  const [session] = useSession();
  const [pollingSyncId, setPollingSyncId] = useState(false);
  const [syncSlideOverOpen, setSyncSlideOverOpen] = useState(false);
  const [syncNotificationVisible, setSyncNotificationVisible] = useState(false);
  const [syncPasswordError, setSyncPasswordError] = useState(false);

  const {
    loading: phaseLoading,
    error: phaseError,
    data: phaseData,
  } = useQuery(PhaseAPI.only, {
    pollInterval: 300000,
  });

  const {
    loading: recommendationLoading,
    error: recommendationError,
    data: recommendation,
  } = useQuery(RecommendationsAPI.random, {
    pollInterval: 10000,
  });

  const {
    loading: userLoading,
    error: userError,
    data: userData,
    refetch: userRefetch,
  } = useQuery(UsersAPI.bySession, {
    variables: { userId: session.id },
  });

  const {
    loading: tracksLoading,
    error: tracksError,
    data: tracksData,
    refetch: tracksRefetch,
  } = useQuery(TracksAPI.bySession, {
    variables: { userId: session.id, phaseNumber: phaseData?.phase.number },
    skip: !phaseData,
  });

  const { error: synchronizationError, data: synchronizationData } = useQuery(
    SynchronizationsAPI.byId,
    {
      variables: { id: pollingSyncId },
      skip: !pollingSyncId,
      pollInterval: 3000,
    }
  );

  const handleSyncCreated = (syncId) => {
    setPollingSyncId(syncId);
  };

  const handleSyncError = () => {
    setSyncPasswordError(true);
    showNotification();
  };

  const showNotification = () => {
    setSyncNotificationVisible(true);
    setTimeout(() => {
      setSyncNotificationVisible(false);
      if (syncPasswordError) {
        setSyncPasswordError(false);
      }
    }, 3000);
  };

  useEffect(() => {
    const synchronization = synchronizationData?.synchronization;
    if (synchronization) {
      if (synchronization.status === SYNCHRONIZATION_STATUSES.success) {
        setPollingSyncId(null);
        tracksRefetch();
        userRefetch();
        showNotification();
      } else {
        if (synchronizationError) {
          showNotification();
        }
      }
    }
  }, [synchronizationData, synchronizationError]);

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
              onSyncClick={() => setSyncSlideOverOpen(true)}
              syncing={pollingSyncId}
            />
            <Skeleton visible={pollingSyncId}>
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
        onClose={() => setSyncSlideOverOpen(false)}
        onSyncCreated={handleSyncCreated}
        onSyncError={handleSyncError}
      />
      <SyncNotification
        show={syncNotificationVisible}
        error={synchronizationError || syncPasswordError}
      />
    </Spinner>
  );
};

export default IndexPageComponent;
