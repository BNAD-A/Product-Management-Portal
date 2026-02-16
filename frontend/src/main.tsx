import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ApolloProvider } from "@apollo/client/react";
import { SnackbarProvider } from "notistack";

import App from "./App";
import { apolloClient } from "./apollo/client";
import { ThemeModeProvider } from "./context/ThemeContext";
import ToastListener from "./ui/ToastListener";

import "./i18n";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ApolloProvider client={apolloClient}>
      <SnackbarProvider maxSnack={3} autoHideDuration={2500}>
        <ToastListener />
        <ThemeModeProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </ThemeModeProvider>
      </SnackbarProvider>
    </ApolloProvider>
  </React.StrictMode>
);
