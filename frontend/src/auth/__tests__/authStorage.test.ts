import { describe, it, expect, beforeEach } from "vitest";
import { getToken, setToken, clearToken } from "../authStorage";

describe("authStorage", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("setToken stores token in localStorage", () => {
    setToken("abc");
    expect(localStorage.getItem("token")).toBe("abc");
  });

  it("getToken returns token from localStorage", () => {
    localStorage.setItem("token", "xyz");
    expect(getToken()).toBe("xyz");
  });

  it("clearToken removes token", () => {
    localStorage.setItem("token", "xyz");
    clearToken();
    expect(localStorage.getItem("token")).toBeNull();
  });
});