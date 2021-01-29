import React from "react";
import EcoScore from "./EcoScore";
import Gamification from "./Gamification";
import Rewards from "./Rewards";
import { USER_GROUPS } from "../../../../utils/constants";

const Strategies = ({ phase, user, recommendation, allUsers, tracks }) => {
  const phaseNumber = phase?.number;
  const userGroup = user?.group;

  if (phaseNumber === 1) return null;

  return (
    <div className="mt-8">
      <div className="max-w-6xl px-4 mx-auto sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-5 mt-2 sm:grid-cols-2 lg:grid-cols-3">
          <EcoScore
            recommendation={recommendation?.text}
            credits={user?.wallet[`credits${phaseNumber}`]}
            score={user?.wallet[`score${phaseNumber}`]}
            phaseNumber={phaseNumber}
            userGroup={userGroup}
          />

          {phaseNumber === 2 && userGroup === USER_GROUPS.rewards && (
            <div className="hidden sm:block" />
          )}

          {(phaseNumber === 3 ||
            (phaseNumber === 2 && userGroup === USER_GROUPS.gamification)) && (
            <Gamification allUsers={allUsers} phaseNumber={phaseNumber} />
          )}

          {phaseNumber === 3 && (
            <div className="hidden sm:block lg:col-span-2" />
          )}

          {(phaseNumber === 3 ||
            (phaseNumber === 2 && userGroup === USER_GROUPS.rewards)) && (
            <Rewards tracks={tracks} />
          )}
        </div>
      </div>
    </div>
  );
};

export default Strategies;
