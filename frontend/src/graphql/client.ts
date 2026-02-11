import { ApolloClient, InMemoryCache, createHttpLink } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";

export const TOKEN_KEY = "pp_token";

const httpLink = createHttpLink({
  uri: "http://127.0.0.1:8000/graphql",
});

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem(TOKEN_KEY);

  return {
    headers: {
      ...headers,
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  };
});

export const apolloClient = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});
