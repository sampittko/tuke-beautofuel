import { gql } from "@apollo/client";

const UsersAPI = {
  bySession: gql`
    query userBySession($userId: ID!) {
      user(id: $userId) {
        group
      }
    }
  `,
  updateCredentials: gql`
    mutation updateUserCredentials(
      $userId: ID!
      $username: String!
      $envirocar: String!
    ) {
      updateUser(
        input: {
          where: { id: $userId }
          data: { username: $username, envirocar: $envirocar }
        }
      ) {
        user {
          username
        }
      }
    }
  `,
  updateSetup: gql`
    mutation updateUserSetup($userId: ID!) {
      updateUser(
        input: { where: { id: $userId }, data: { setupCompleted: true } }
      ) {
        user {
          setupCompleted
        }
      }
    }
  `,
};

export default UsersAPI;
