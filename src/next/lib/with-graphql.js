import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";

const WithGraphQL = ({ session, children }) => {
  const token = session?.jwt?.toString();

  const client = new ApolloClient({
    uri:
      process.env.NODE_ENV === "production"
        ? `${process.env.NEXT_PUBLIC_PUBLIC_API_URL}/graphql`
        : `${process.env.NEXT_PUBLIC_PUBLIC_API_URL_DEV}/graphql`,
    credentials: "same-origin",
    cache: new InMemoryCache(),
    headers: {
      authorization: `Bearer ${token}`,
    },
  });

  return <ApolloProvider client={client}>{children}</ApolloProvider>;
};

export default WithGraphQL;
