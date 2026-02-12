import React, { PropsWithChildren } from "react";
import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

import { I18nextProvider } from "react-i18next";
import i18n from "../i18n";

import { MockedProvider, MockedResponse } from "@apollo/client/testing";

type Options = {
  route?: string;
  mocks?: readonly MockedResponse[];
};

function Providers({
  children,
  route = "/",
  mocks = [],
}: PropsWithChildren<Options>) {
  const theme = createTheme();

  return (
    <MockedProvider mocks={mocks} addTypename={false}>
      <I18nextProvider i18n={i18n}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <MemoryRouter initialEntries={[route]}>{children}</MemoryRouter>
        </ThemeProvider>
      </I18nextProvider>
    </MockedProvider>
  );
}

export function renderWithProviders(
  ui: React.ReactElement,
  options: Options = {}
) {
  return render(<Providers {...options}>{ui}</Providers>);
}