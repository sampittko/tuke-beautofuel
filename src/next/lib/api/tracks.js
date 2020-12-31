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
};

export default TracksAPI;
