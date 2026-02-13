import React, { PropsWithChildren } from "react";
import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

import { I18nextProvider } from "react-i18next";
import i18n from "../i18n";

type Options = { route?: string };

function Providers({ children, route = "/" }: PropsWithChildren<Options>) {
  const theme = createTheme();

  return (
    <I18nextProvider i18n={i18n}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <MemoryRouter initialEntries={[route]}>{children}</MemoryRouter>
      </ThemeProvider>
    </I18nextProvider>
  );
}

export function renderWithProviders(ui: React.ReactElement, options: Options = {}) {
  return render(<Providers {...options}>{ui}</Providers>);
}