import { screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { mockUseMutation, mockUseQuery } from "../../test/setup";
import { renderWithProviders } from "../../test/test-utils";
import ProductsPage from "../ProductsPage";

vi.mock("@apollo/client", async (importOriginal) => {
  const actual: any = await importOriginal();
  return {
    ...actual,
    useQuery: (...args: any[]) => mockUseQuery(...args),
    useMutation: (...args: any[]) => mockUseMutation(...args),
  };
});
describe("ProductsPage (data)", () => {
  it("shows product rows", async () => {
    localStorage.setItem("lang", "en");

    mockUseQuery.mockReturnValueOnce({
      data: {
        products: [
          { id: "1", name: "Mouse", price: 10, quantity: 2 },
          { id: "2", name: "Keyboard", price: 20, quantity: 1 },
        ],
      },
      loading: false,
      error: undefined,
      refetch: async () => ({}),
    });

    renderWithProviders(<ProductsPage />);

    expect(await screen.findByText("Mouse")).toBeInTheDocument();
    expect(screen.getByText("Keyboard")).toBeInTheDocument();
  });
});
