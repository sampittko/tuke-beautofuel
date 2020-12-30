import { gql } from "@apollo/client";

const UsersAPI = {
  bySession: gql`
    query bySession($userId: ID!) {
      user(id: $userId) {
        group
      }
    }
  `,
};

export default UsersAPI;
