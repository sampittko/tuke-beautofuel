import { gql } from "@apollo/client";

const RecommendationsAPI = {
  random: gql`
    query {
      recommendation(id: "random") {
        text
      }
    }
  `,
};

export default RecommendationsAPI;
