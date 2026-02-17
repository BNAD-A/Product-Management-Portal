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
import { describe, expect, it } from "vitest";
import { renderWithProviders } from "../../test/test-utils";
import LoginPage from "../LoginPage";

describe("LoginPage - component", () => {
  it("renders the form", () => {
    renderWithProviders(<LoginPage />);
    expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
  });

  it("disables submit when fields are empty", () => {
    renderWithProviders(<LoginPage />);
    const btn = screen.getByRole("button", { name: /login/i });
    expect(btn).toBeDisabled();
  });
});
