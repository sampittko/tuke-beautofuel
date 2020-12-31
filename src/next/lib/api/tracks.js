import { gql } from "@apollo/client";

const TracksAPI = {
  bySession: gql`
    query tracksBySession($userId: ID!) {
      tracks(where: { user: $userId }, sort: "createdAt") {
        duration
        score
        scoreDistance
        totalDistance
        date
        converted
      }
    }
  `,
  top10: gql`
    query top10Tracks {
      tracks {
        user {
          username
          wallet {
            credits
          }
        }
        duration
        totalDistance
      }
    }
  `,
};

export default TracksAPI;
