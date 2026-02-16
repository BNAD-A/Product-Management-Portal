import {
  ApolloClient,
  InMemoryCache,
  createHttpLink,
  from,
} from "@apollo/client";
import { onError } from "@apollo/client/link/error";
import { setContext } from "@apollo/client/link/context";
import { getToken, clearToken } from "../auth/authStorage";

const httpLink = createHttpLink({
  uri: "http://localhost:8000/graphql",
});

const authLink = setContext((_, { headers }) => {
  const token = getToken();
  return {
    headers: {
      ...headers,
      Authorization: token ? `Bearer ${token}` : "",
    },
  };
});

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    for (const err of graphQLErrors) {
      const msg = (err.message || "").toLowerCase();

      // 401 Unauthorized -> logout + redirect login
      if (msg.includes("unauthorized")) {
        clearToken();
        window.location.href = "/login";
        return;
      }

      // 403 Forbidden -> message
      if (msg.includes("forbidden")) {
        alert("Access denied");
      }
    }
  }

  // Network error
  if (networkError) {
    alert("Server unreachable");
  }
});

export const apolloClient = new ApolloClient({
  link: from([errorLink, authLink, httpLink]),
  cache: new InMemoryCache(),
});

export const client = apolloClient;
