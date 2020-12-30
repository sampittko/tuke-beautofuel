import { gql } from "@apollo/client";

const UsersAPI = {
  bySession: gql`
    query bySession($userId: ID!) {
      user(id: $userId) {
        group
      }
    }
  `,
  updateUsername: gql`
    mutation updateUsername($userId: ID!, $username: String!) {
      updateUser(
        input: { where: { id: $userId }, data: { username: $username } }
      ) {
        user {
          username
        }
      }
    }
  `,
};

export default UsersAPI;
