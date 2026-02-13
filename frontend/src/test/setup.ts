import "@testing-library/jest-dom";
export { mockUseQuery, mockUseMutation } from "./mocks/apolloHooks";

Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener: () => {},
    removeEventListener: () => {},
    addListener: () => {},
    removeListener: () => {},
    dispatchEvent: () => false,
  }),
});

import i18n from "../i18n";
import { afterEach } from "vitest";

afterEach(async () => {
  await i18n.changeLanguage("en");
  localStorage.removeItem("lang");
  localStorage.removeItem("pp_lang");
});