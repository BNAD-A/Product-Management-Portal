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

import { fireEvent, screen } from "@testing-library/react";
import { renderWithProviders } from "../../test/test-utils";
import ProductFormPage from "../ProductFormPage";

describe("ProductFormPage - validation", () => {
  it("shows validation errors on empty submit", async () => {
    const { container } = renderWithProviders(<ProductFormPage />);

    const form = container.querySelector("form");
    if (!form) throw new Error("No <form> found");

    fireEvent.submit(form);

    expect(await screen.findByText(/required/i)).toBeInTheDocument();
  });
});
