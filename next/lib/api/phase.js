import { gql } from "@apollo/client";

const PhaseAPI = {
  only: gql`
    query {
      phase {
        number
        startDate
        endDate
      }
    }
  `,
};

export default PhaseAPI;
