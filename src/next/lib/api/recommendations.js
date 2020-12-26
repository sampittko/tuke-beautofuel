import { gql } from "@apollo/client";

const RecommendationsAPI = {
  all: gql`
    query {
      recommendations {
        text
      }
    }
  `,
};

export default RecommendationsAPI;
