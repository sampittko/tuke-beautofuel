import { gql } from "@apollo/client";

const TracksAPI = {
  bySession: gql`
    query tracksBySession($userId: ID!, $phaseNumber: Int!) {
      tracks(
        where: { user: $userId, phaseNumber: $phaseNumber }
        sort: "createdAt"
      ) {
        duration
        score
        scoreDistance
        totalDistance
        date
        converted
        purchase {
          quantity
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
            credits2
            credits3
          }
          group
        }
        duration
        totalDistance
      }
    }
  `,
};

export default TracksAPI;
