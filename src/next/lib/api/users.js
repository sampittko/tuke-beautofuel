import { gql } from "@apollo/client";

const UsersAPI = {
  bySession: gql`
    query bySession($userId: ID!) {
      user(id: $userId) {
        id
        group
        setup {
          id
        }
      }
    }
  `,
};

export default UsersAPI;
