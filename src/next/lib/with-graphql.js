import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
import { getApiUrl } from "../utils/functions";

const WithGraphQL = ({ session, children }) => {
  const token = session?.jwt?.toString();

  const client = new ApolloClient({
    uri: `${getApiUrl()}/graphql`,
    credentials: "same-origin",
    cache: new InMemoryCache(),
    headers: {
      authorization: `Bearer ${token}`,
    },
  });

  return <ApolloProvider client={client}>{children}</ApolloProvider>;
};

export default WithGraphQL;
