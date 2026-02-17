import { screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { renderWithProviders } from "../../test/test-utils";
import LoginPage from "../LoginPage";

import i18n from "../../i18n";

vi.mock("@apollo/client/react", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@apollo/client/react")>();
  return {
    ...actual,
    useMutation: () => [vi.fn(), { loading: false, error: undefined }],
  };
});

describe("LoginPage", () => {
  beforeEach(() => {
    i18n.changeLanguage("en");
  });

  it("shows English labels by default", () => {
    renderWithProviders(<LoginPage />, { route: "/login" });

    expect(screen.getByText(i18n.t("auth.loginTitle"))).toBeInTheDocument();
    expect(screen.getByLabelText(i18n.t("auth.username"))).toBeInTheDocument();
    expect(screen.getByLabelText(i18n.t("auth.password"))).toBeInTheDocument();
  });
});
