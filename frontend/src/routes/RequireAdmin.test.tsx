import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { beforeEach, describe, expect, it } from "vitest";
import { makeJwt } from "../test/helpers/jwt";
import RequireAdmin from "./RequireAdmin";

function renderApp(initialPath: string) {
  return render(
    <MemoryRouter initialEntries={[initialPath]}>
      <Routes>
        <Route path="/products" element={<div>PRODUCTS_PAGE</div>} />
        <Route element={<RequireAdmin />}>
          <Route path="/admin/users" element={<div>ADMIN_USERS_PAGE</div>} />
        </Route>
      </Routes>
    </MemoryRouter>,
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
