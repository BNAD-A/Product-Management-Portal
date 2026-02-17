import { screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { renderWithProviders } from "../../test/test-utils";
import ProductsPage from "../ProductsPage";

import i18n from "../../i18n";

vi.mock("@apollo/client/react", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@apollo/client/react")>();
  return {
    ...actual,
    useQuery: () => ({
      data: {
        products: [{ id: "1", name: "P1", description: "d1", price: 10, quantity: 2 }],
      },
      loading: false,
      error: undefined,
      refetch: vi.fn(),
    }),
    useMutation: () => [vi.fn(), { loading: false, error: undefined }],
  };
});

describe("ProductsPage (data)", () => {
  beforeEach(() => {
    i18n.changeLanguage("en");
  });

  it("shows product rows", () => {
    renderWithProviders(<ProductsPage />, { route: "/products" });
    expect(screen.getByText("P1")).toBeInTheDocument();
  });
});
