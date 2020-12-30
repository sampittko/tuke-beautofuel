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
  setupCompleted: gql`
    mutation setupCompleted($userId: ID!) {
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
