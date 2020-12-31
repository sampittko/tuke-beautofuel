import { gql } from "@apollo/client";

const RecommendationsAPI = {
  random: gql`
    query randomRecommendation {
      recommendation(id: "random") {
        text
      }
    }
  `,
};

export default RecommendationsAPI;
