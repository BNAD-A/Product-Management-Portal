import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ApolloProvider } from "@apollo/client";

import App from "./App";
import { client } from "./apollo/client"; // <-- ton client Apollo
import { ThemeModeProvider } from "./context/ThemeContext";
import { SnackbarProvider } from "notistack";

import "./i18n";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <SnackbarProvider maxSnack={3} autoHideDuration={2500}>
        <ThemeModeProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </ThemeModeProvider>
      </SnackbarProvider>
    </ApolloProvider>
  </React.StrictMode>
);
