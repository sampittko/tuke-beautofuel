import { gql } from "@apollo/client";

const UsersAPI = {
  bySession: gql`
    query bySession($userId: ID!) {
      user(id: $userId) {
        group
      }
    }
  `,
  setupUpdate: gql`
    mutation setupUpdate(
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
  setupFinished: gql`
    mutation setupFinished($userId: ID!) {
      updateUser(
        input: { where: { id: $userId }, data: { setupFinished: true } }
      ) {
        user {
          setupFinished
        }
      }
    }
  `,
};

export default UsersAPI;
