import { gql } from "@apollo/client";

export const ME_QUERY = gql`
  query Me {
    me {
      id
      username
      role
    }
  }
`;

export const PRODUCTS_QUERY = gql`
  query Products {
    products {
      id
      name
      description
      price
      quantity
    }
  }
`;

export const PRODUCT_BY_ID_QUERY = gql`
  query ProductById($id: Int!) {
    productById(id: $id) {
      id
      name
      description
      price
      quantity
    }
  }
`;
