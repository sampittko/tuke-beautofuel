import { gql } from "@apollo/client";

const TracksAPI = {
  bySession: gql`
    query tracksBySession($userId: ID!, $phaseNumber: Int!) {
      tracks(where: { user: $userId, phaseNumber: $phaseNumber }) {
        id
        duration
        score
        totalDistance
        consumption
        scoreConsumption
        fuelConsumed
        scoreFuelConsumed
        speed
        scoreSpeed
        date
        purchase {
          id
          quantity
          made
        }
      }
    }
  `,
  top10: gql`
    query top10Tracks($phaseNumber: Int!) {
      tracks(where: { phaseNumber: $phaseNumber }) {
        user {
          id
          username
          wallet {
            score2
            score3
          }
          group
        }
        duration
        totalDistance
        fuelConsumed
      }
    }
  `,
  gamification: gql`
    query gamificationTracks($phaseNumber: Int!) {
      tracks(where: { phaseNumber: $phaseNumber }) {
        user {
          id
          username
          wallet {
            score2
            score3
          }
          group
        }
      }
    }
  `,
};

export default TracksAPI;
