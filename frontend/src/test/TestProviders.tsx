import { SnackbarProvider } from "notistack";
import React from "react";
import { MemoryRouter } from "react-router-dom";

import { ApolloClient, HttpLink, InMemoryCache } from "@apollo/client";
import { ApolloProvider } from "@apollo/client/react";

import { ThemeModeProvider } from "../context/ThemeContext";
import "../i18n";

type Props = {
    children: React.ReactNode;
    initialEntries?: string[];
};

const client = new ApolloClient({
    link: new HttpLink({ uri: "/graphql" }),
    cache: new InMemoryCache(),
});

export function TestProviders({ children, initialEntries = ["/"] }: Props) {
    return (
        <ApolloProvider client={client}>
            <ThemeModeProvider>
                <SnackbarProvider maxSnack={3}>
                    <MemoryRouter initialEntries={initialEntries}>{children}</MemoryRouter>
                </SnackbarProvider>
            </ThemeModeProvider>
        </ApolloProvider>
    );
}
