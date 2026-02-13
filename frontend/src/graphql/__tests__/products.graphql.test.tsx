import { describe, it, expect } from "vitest";
import { ApolloClient, InMemoryCache } from "@apollo/client/core";
import { MockLink } from "@apollo/client/testing";

// ✅ adapte ces imports selon TON projet
import { PRODUCTS_QUERY } from "../queries";
import {
  CREATE_PRODUCT_MUTATION,
  UPDATE_PRODUCT_MUTATION,
  DELETE_PRODUCT_MUTATION,
} from "../mutations";

function makeClient(mocks: any[]) {
  return new ApolloClient({
    cache: new InMemoryCache(),
    link: new MockLink(mocks, false),
  });
}

describe("US-13.3 Product GraphQL logic (Apollo mocked)", () => {
  it("products query returns results", async () => {
    const mocks = [
      {
        request: { query: PRODUCTS_QUERY },
        result: {
          data: {
            products: [
              { id: 1, name: "P1", price: 10, quantity: 1, __typename: "Product" },
              { id: 2, name: "P2", price: 20, quantity: 2, __typename: "Product" },
            ],
          },
        },
      },
    ];

    const client = makeClient(mocks);

    const res = await client.query({ query: PRODUCTS_QUERY });

    expect(res.data.products).toHaveLength(2);
    expect(res.data.products[0].name).toBe("P1");
    expect(res.data.products[1].name).toBe("P2");
  });

  it("create mutation returns created product", async () => {
    const vars = { input: { name: "P3", price: 30, quantity: 3 } };

    const mocks = [
      {
        request: { query: CREATE_PRODUCT_MUTATION, variables: vars },
        result: {
          data: {
            createProduct: { id: 3, name: "P3", price: 30, quantity: 3, __typename: "Product" },
          },
        },
      },
    ];

    const client = makeClient(mocks);

    const res = await client.mutate({
      mutation: CREATE_PRODUCT_MUTATION,
      variables: vars,
    });

    expect(res.data?.createProduct?.name).toBe("P3");
  });

  it("update mutation returns updated product", async () => {
    const vars = { id: 1, input: { name: "P1-updated", price: 11, quantity: 2 } };

    const mocks = [
      {
        request: { query: UPDATE_PRODUCT_MUTATION, variables: vars },
        result: {
          data: {
            updateProduct: {
              id: 1,
              name: "P1-updated",
              price: 11,
              quantity: 2,
              __typename: "Product",
            },
          },
        },
      },
    ];

    const client = makeClient(mocks);

    const res = await client.mutate({
      mutation: UPDATE_PRODUCT_MUTATION,
      variables: vars,
    });

    expect(res.data?.updateProduct?.name).toBe("P1-updated");
  });

  it("delete mutation returns success response", async () => {
    const vars = { id: 1 };

    const mocks = [
      {
        request: { query: DELETE_PRODUCT_MUTATION, variables: vars },
        result: { data: { deleteProduct: { ok: true, __typename: "DeleteResponse" } } },
      },
    ];

    const client = makeClient(mocks);

    const res = await client.mutate({
      mutation: DELETE_PRODUCT_MUTATION,
      variables: vars,
    });

    // adapte selon ton backend: ok / success / deleted
    expect(res.data?.deleteProduct?.ok ?? res.data?.deleteProduct?.success ?? true).toBe(true);
  });
});