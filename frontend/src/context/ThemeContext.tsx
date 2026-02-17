import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import React, { createContext, useContext, useMemo, useState } from "react";

export type Mode = "light" | "dark";

type ThemeContextType = {
  mode: Mode;
  toggleTheme: () => void;
};

const ThemeModeContext = createContext<ThemeContextType | null>(null);

export function ThemeModeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<Mode>("light");

  const toggleTheme = () => {
    setMode((prev) => (prev === "light" ? "dark" : "light"));
  };

  const theme = useMemo(
    () =>
      createTheme({
        palette: { mode },
      }),
    [mode]
  );

  return (
    <ThemeModeContext.Provider value={{ mode, toggleTheme }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeModeContext.Provider>
  );
}

export function useThemeMode() {
  const ctx = useContext(ThemeModeContext);
  if (!ctx) throw new Error("useThemeMode must be used inside ThemeModeProvider");
  return ctx;
}
