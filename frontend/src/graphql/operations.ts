// src/graphql/operations.ts
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

export const PRODUCT_BY_ID = gql`
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

export const CREATE_PRODUCT = gql`
  mutation CreateProduct($input: ProductInput!) {
    createProduct(input: $input) {
      id
      name
      description
      price
      quantity
    }
  }
`;

export const UPDATE_PRODUCT = gql`
  mutation UpdateProduct($id: Int!, $input: ProductInput!) {
    updateProduct(id: $id, input: $input) {
      id
      name
      description
      price
      quantity
    }
  }
`;

export const DELETE_PRODUCT = gql`
  mutation DeleteProduct($id: Int!) {
    deleteProduct(id: $id)
  }
`;
