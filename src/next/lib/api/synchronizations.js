import { gql } from "@apollo/client";

const SynchronizationsAPI = {
  create: gql`
    mutation createSynchronization {
      createSynchronization {
        synchronization {
          status
        }
      }
    }
  `,
};

export default SynchronizationsAPI;
