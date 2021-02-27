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
};

export default TracksAPI;
