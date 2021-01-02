import { gql } from "@apollo/client";

const UsersAPI = {
  bySession: gql`
    query userBySession($userId: ID!) {
      user(id: $userId) {
        username
        group
        wallet {
          credits2
          credits3
        }
        notified1
        notified2
        notified3
      }
    }
  `,
  updateUsernameAndEnvirocar: gql`
    mutation updateUserUsernameAndEnvirocar(
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
  completeSetup: gql`
    mutation completeSetup($userId: ID!) {
      updateUser(
        input: { where: { id: $userId }, data: { setupCompleted: true } }
      ) {
        user {
          setupCompleted
        }
      }
    }
  `,
  notified: gql`
    mutation phaseNotified(
      $userId: ID!
      $notified1: Boolean!
      $notified2: Boolean!
      $notified3: Boolean!
    ) {
      updateUser(
        input: {
          where: { id: $userId }
          data: {
            notified1: $notified1
            notified2: $notified2
            notified3: $notified3
          }
        }
      ) {
        user {
          notified1
          notified2
          notified3
        }
      }
    }
  `,
  allUsernamesByStrategy: gql`
    query allUsernamesByStrategy {
      gamificationUsernames: users(where: { group: "gamification" }) {
        id
        username
        group
      }
      rewardsUsernames: users(where: { group: "rewards" }) {
        id
        username
        group
      }
    }
  `,
  allUsersWithWallets: gql`
    query allUsers {
      users {
        id
        wallet {
          credits2
          credits3
        }
        group
      }
    }
  `,
};

export default UsersAPI;
