import { gql } from "@apollo/client";

const PhaseAPI = {
  only: gql`
    query onlyPhase {
      phase {
        number
        startDate
        endDate
      }
    }
  `,
};

export default PhaseAPI;
