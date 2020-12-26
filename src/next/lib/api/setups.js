import { gql } from "@apollo/client";

const SetupsAPI = {
  bySession: gql`
    query bySession($setupId: ID!) {
      setup(id: $setupId) {
        id
        step1
        step2
        step3
        step4
      }
    }
  `,
};

export default SetupsAPI;
