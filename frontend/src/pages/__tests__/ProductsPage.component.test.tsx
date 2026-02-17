import { vi } from "vitest";
import { mockUseMutation, mockUseQuery } from "../../test/mocks/apolloHooks";

vi.mock("@apollo/client", async () => {
  const actual: any = await vi.importActual("@apollo/client");
  return {
    ...actual,
    useQuery: (...args: any[]) => mockUseQuery(...args),
    useMutation: (...args: any[]) => mockUseMutation(...args),
  };
});

import { screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { renderWithProviders } from "../../test/test-utils";
import ProductsListPage from "../ProductsPage";

describe("ProductsPage - component", () => {
  beforeEach(() => {
    mockUseQuery.mockReset();
  });

  it("renders product rows", async () => {
    mockUseQuery.mockReturnValueOnce({
      data: { products: [{ id: "1", name: "Apple", price: 10 }] },
      loading: false,
      error: undefined,
      refetch: async () => ({}),
    });

    renderWithProviders(<ProductsListPage />);

    expect(await screen.findByText("Apple")).toBeInTheDocument();
    expect(screen.getByText("10")).toBeInTheDocument();
  });
});
