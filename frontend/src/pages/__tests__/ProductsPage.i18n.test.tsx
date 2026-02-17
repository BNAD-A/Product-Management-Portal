import { screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import i18n from "../../i18n";
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
describe("ProductsPage i18n", () => {
  it("renders in French when lang=fr", async () => {
    localStorage.setItem("lang", "fr");
    await i18n.changeLanguage("fr"); // ✅ IMPORTANT

    mockUseQuery.mockReturnValueOnce({
      data: { products: [] },
      loading: false,
      error: undefined,
      refetch: async () => ({}),
    });

    renderWithProviders(<ProductsPage />);

    expect(await screen.findByRole("heading", { name: "Produits" })).toBeInTheDocument();
    expect(screen.getByText("Nom")).toBeInTheDocument();
    expect(screen.getByText("Prix")).toBeInTheDocument();
    expect(screen.getByText("Quantité")).toBeInTheDocument();
  });
});
