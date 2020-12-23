import { gql } from "@apollo/client";

const PhaseAPI = {
  get: gql`
    query {
      phase {
        number
        startDate
        endDate
        description
      }
    }
  `,
};

export default PhaseAPI;
