import { useQuery, gql } from "@apollo/client";

const ME_QUERY = gql`
  query Me {
    me {
      id
      username
      role
    }
  }
`;

export function useMe() {
  const { data, loading, error } = useQuery(ME_QUERY, {
    fetchPolicy: "cache-first",
  });

  // Si le backend renvoie Unauthorized, on nettoie le token
  if (error) {
    // option simple: on invalide le token pour éviter le "loading null" infini
    localStorage.removeItem("token");
    return { me: null, loading: false };
  }

  return { me: data?.me ?? null, loading };
}
