import { gql } from "@apollo/client";

const UsersAPI = {
  bySession: gql`
    query userBySession($userId: ID!) {
      user(id: $userId) {
        group
        wallet {
          credits2
          credits3
        }
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
  allUsernamesByStrategy: gql`
    query allUsernamesByStrategy {
      gamificationUsernames: users(where: { group: "gamification" }) {
        username
      }
      rewardsUsernames: users(where: { group: "rewards" }) {
        username
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
