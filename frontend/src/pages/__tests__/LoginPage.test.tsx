import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithProviders } from "../../test/test-utils";
import LoginPage from "../LoginPage";

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

describe("LoginPage", () => {
  it("shows English labels by default", () => {
    localStorage.removeItem("lang");
    localStorage.removeItem("pp_lang");

    renderWithProviders(<LoginPage />);

    expect(screen.getByRole("heading", { name: "Login" })).toBeInTheDocument();

    expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();

    expect(screen.getByRole("button", { name: /^login$/i })).toBeInTheDocument();
  });
});