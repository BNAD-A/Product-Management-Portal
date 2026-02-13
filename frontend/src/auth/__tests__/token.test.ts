import { describe, it, expect, beforeEach } from "vitest";
import { makeJwt } from "../../test/helpers/jwt";
import { getTokenPayload, isTokenValid } from "../token";

describe("token logic", () => {
  beforeEach(() => localStorage.clear());

  it("isTokenValid returns false when no token", () => {
    expect(isTokenValid()).toBe(false);
  });

  it("isTokenValid returns true for non-expired token", () => {
    const exp = Math.floor(Date.now() / 1000) + 60;
    localStorage.setItem("token", makeJwt({ exp, role: "ADMIN", userId: 1, username: "admin1" }));
    expect(isTokenValid()).toBe(true);
  });

  it("isTokenValid returns false for expired token", () => {
    const exp = Math.floor(Date.now() / 1000) - 60;
    localStorage.setItem("token", makeJwt({ exp, role: "ADMIN" }));
    expect(isTokenValid()).toBe(false);
  });

  it("getTokenPayload returns parsed payload", () => {
    const exp = Math.floor(Date.now() / 1000) + 60;
    localStorage.setItem("token", makeJwt({ exp, role: "USER", userId: 7, username: "bob" }));

    const payload: any = getTokenPayload();
    expect(payload?.role).toBe("USER");
    expect(payload?.userId).toBe(7);
    expect(payload?.username).toBe("bob");
  });
});