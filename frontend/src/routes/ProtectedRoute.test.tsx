import { describe, it, expect, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";

function renderApp(initialPath: string) {
  return render(
    <MemoryRouter initialEntries={[initialPath]}>
      <Routes>
        <Route path="/login" element={<div>LOGIN_PAGE</div>} />
        <Route element={<ProtectedRoute />}>
          <Route path="/products" element={<div>PRODUCTS_PAGE</div>} />
        </Route>
      </Routes>
    </MemoryRouter>
  );
}

describe("ProtectedRoute", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("redirects to /login when token missing", () => {
    renderApp("/products");
    expect(screen.getByText("LOGIN_PAGE")).toBeInTheDocument();
  });

  it("renders protected page when token is valid", () => {
    localStorage.setItem("token", "any.token.value");
    renderApp("/products");
    expect(screen.getByText("PRODUCTS_PAGE")).toBeInTheDocument();
  });
});