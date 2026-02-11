import { ApolloClient, InMemoryCache, HttpLink, from } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { onError } from "@apollo/client/link/error";
import { emitLogout } from "../auth/events";

const httpLink = new HttpLink({
  uri: "http://localhost:8000/graphql", // adapte si besoin
});

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem("token"); // ta clé actuelle
  return {
    headers: {
      ...headers,
      Authorization: token ? `Bearer ${token}` : "",
    },
  };
});

const errorLink = onError(({ graphQLErrors, networkError }) => {
  // GraphQL errors
  if (graphQLErrors?.length) {
    const unauthorized = graphQLErrors.some((e) =>
      String(e.message || "").toLowerCase().includes("unauthorized")
    );
    if (unauthorized) emitLogout("Unauthorized (GraphQL)");
  }

  // Network errors
  // @ts-expect-error (Apollo types)
  const statusCode = networkError?.statusCode || networkError?.response?.status;
  if (statusCode === 401) {
    emitLogout("401 (Network)");
  }
});

export const client = new ApolloClient({
  link: from([errorLink, authLink.concat(httpLink)]),
  cache: new InMemoryCache(),
});
