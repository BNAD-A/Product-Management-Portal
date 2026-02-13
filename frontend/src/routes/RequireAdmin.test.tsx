import { describe, it, expect, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import RequireAdmin from "./RequireAdmin";
import { makeJwt } from "../test/helpers/jwt";

function renderApp(initialPath: string) {
  return render(
    <MemoryRouter initialEntries={[initialPath]}>
      <Routes>
        <Route path="/products" element={<div>PRODUCTS_PAGE</div>} />
        <Route element={<RequireAdmin />}>
          <Route path="/admin/users" element={<div>ADMIN_USERS_PAGE</div>} />
        </Route>
      </Routes>
    </MemoryRouter>
  );
}

describe("RequireAdmin", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("redirects non-admin to /products", () => {
    localStorage.setItem("token", makeJwt({ role: "USER" }));
    renderApp("/admin/users");
    expect(screen.getByText("PRODUCTS_PAGE")).toBeInTheDocument();
  });

  it("allows admin", () => {
    localStorage.setItem("token", makeJwt({ role: "ADMIN" }));
    renderApp("/admin/users");
    expect(screen.getByText("ADMIN_USERS_PAGE")).toBeInTheDocument();
  });
});