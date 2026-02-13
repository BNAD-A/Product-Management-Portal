import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithProviders } from "../../test/test-utils";
import ProductsPage from "../ProductsPage";
import { vi } from "vitest";
import { mockUseQuery, mockUseMutation } from "../../test/setup";

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