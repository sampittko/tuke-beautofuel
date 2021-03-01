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
import History from "./history/";
import SyncSlideOver from "./SyncSlideOver";
import SyncNotification from "./notifications/SyncNotification";
import PurchaseNotification from "./notifications/PurchaseNotification";
import Skeleton from "./Skeleton";
import TracksAPI from "../../../lib/api/tracks";
import SynchronizationsAPI from "../../../lib/api/synchronizations";
import { SYNCHRONIZATION_STATUSES } from "../../../utils/constants";
import PhaseBanner from "./PhaseBanner";
import ExperimentOverviewLink from "./ExperimentOverviewLink";
import { getApiUrl } from "../../../utils/functions";
import axios from "axios";

const IndexPageComponent = () => {
  const [session] = useSession();
  const [pollingSyncId, setPollingSyncId] = useState(false);
  const [syncSlideOverOpen, setSyncSlideOverOpen] = useState(false);
  const [syncNotificationVisible, setSyncNotificationVisible] = useState(false);
  const [
    purchaseNotificationDetails,
    setPurchaseNotificationDetails,
  ] = useState(null);
  const [syncPasswordError, setSyncPasswordError] = useState(false);
  const [
    experimentOverviewLinkVisible,
    setExperimentOverviewLinkVisible,
  ] = useState(false);
  const [historyStartIdx, setHistoryStartIdx] = useState(null);

  // last minute refactoring
  const [position, setPosition] = useState(null);
  const [positionLoading, setPositionLoading] = useState(false);
  const [positionError, setPositionError] = useState(null);

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
    data: recommendationData,
  } = useQuery(RecommendationsAPI.random, {
    pollInterval: 10000,
    skip: phaseData?.phase.number === 1,
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
    showSyncNotification();
  };

  const showSyncNotification = () => {
    setSyncNotificationVisible(true);
    setTimeout(() => {
      setSyncNotificationVisible(false);
      setSyncPasswordError(false);
    }, 3000);
  };

  const showPurchaseNotification = (purchased, quantity) => {
    setPurchaseNotificationDetails({
      purchased,
      quantity,
    });
    setTimeout(() => {
      setPurchaseNotificationDetails(null);
    }, 3000);
  };

  useEffect(() => {
    const synchronization = synchronizationData?.synchronization;
    if (synchronization) {
      if (synchronization.status === SYNCHRONIZATION_STATUSES.success) {
        setPollingSyncId(null);
        tracksRefetch();
        userRefetch();
        showSyncNotification();
      } else {
        if (synchronizationError) {
          showSyncNotification();
        }
      }
    }
  }, [synchronizationData, synchronizationError]);

  useEffect(() => {
    if (tracksData) {
      setHistoryStartIdx(tracksData.tracks.length - 1);
    }
  }, [tracksData]);

  useEffect(() => {
    if (
      session &&
      (phaseData?.phase.number === 2 || phaseData?.phase.number === 3)
    ) {
      console.log(phaseData?.phase.number);
      setPositionError(null);
      setPositionLoading(true);
      axios
        .get(`${getApiUrl()}/tracks/top10/position`, {
          headers: {
            authorization: `Bearer ${session.jwt}`,
          },
        })
        .then((res) => {
          setPosition(res.data);
        })
        .catch((err) => {
          setPositionError(err);
        })
        .finally(() => {
          setPositionLoading(false);
        });
    }
  }, [tracksData?.tracks.length, phaseData?.phase.number]);

  return (
    <Spinner
      dependencies={[
        phaseLoading,
        recommendationLoading,
        userLoading,
        tracksLoading,
        positionLoading,
      ]}
      errors={[
        phaseError,
        recommendationError,
        userError,
        tracksError,
        positionError,
      ]}
    >
      <div className="z-0 flex h-screen overflow-hidden bg-gray-100">
        <div className="flex-1 overflow-auto focus:outline-none" tabIndex="0">
          <Navigation />
          <main className="relative z-0 flex-1 pb-8 overflow-y-auto">
            <Header
              username={userData?.user.username}
              phase={phaseData?.phase}
              onSyncClick={() => setSyncSlideOverOpen(true)}
              syncing={!!pollingSyncId}
            />
            <Skeleton visible={!!pollingSyncId}>
              <Strategies
                user={userData?.user}
                phase={phaseData?.phase}
                recommendation={recommendationData?.recommendation}
                tracks={tracksData?.tracks}
                position={position}
              />
              <Stats tracks={tracksData?.tracks} />
              <History
                startIdx={historyStartIdx}
                onIdxChange={(newIdx) => setHistoryStartIdx(newIdx)}
                user={userData?.user}
                phase={phaseData?.phase}
                tracks={tracksData?.tracks}
                tracksRefetch={tracksRefetch}
                userRefetch={userRefetch}
                onAction={showPurchaseNotification}
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
      <PurchaseNotification purchaseDetails={purchaseNotificationDetails} />
      <PhaseBanner
        user={userData?.user}
        phaseNumber={phaseData?.phase.number}
        onNotified={() => setExperimentOverviewLinkVisible(true)}
      />
      {experimentOverviewLinkVisible && (
        <ExperimentOverviewLink
          userGroup={userData?.user.group}
          phaseNumber={phaseData?.phase.number}
        />
      )}
    </Spinner>
  );
};

export default IndexPageComponent;
