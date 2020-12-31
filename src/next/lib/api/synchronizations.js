import { gql } from "@apollo/client";

const SynchronizationsAPI = {
  create: gql`
    mutation createSynchronization {
      createSynchronization {
        synchronization {
          id
        }
      }
    }
  `,
  byId: gql`
    query getSynchronizationById($id: ID!) {
      synchronization(id: $id) {
        status
      }
    }
  `,
};

export default SynchronizationsAPI;
