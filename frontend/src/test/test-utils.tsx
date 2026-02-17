import { render, type RenderOptions } from "@testing-library/react";
import React from "react";
import { TestProviders } from "./TestProviders";

type Options = RenderOptions & {
  route?: string;
};

export function renderWithProviders(ui: React.ReactElement, options?: Options) {
  const route = options?.route ?? "/";
  const { ...rest } = options ?? {};

  return render(ui, {
    wrapper: ({ children }) => <TestProviders initialEntries={[route]}>{children}</TestProviders>,
    ...rest,
  });
}
