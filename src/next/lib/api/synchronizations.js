import { gql } from "@apollo/client";

const SynchronizationsAPI = {
  create: gql`
    mutation {
      createSynchronization {
        synchronization {
          status
        }
      }
    }
  `,
};

export default SynchronizationsAPI;
