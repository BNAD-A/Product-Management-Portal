import { createContext, useContext, useMemo, useState } from "react";
import { ThemeProvider, createTheme, CssBaseline } from "@mui/material";

type Mode = "light" | "dark";

type ThemeContextType = {
  mode: Mode;
  toggleTheme: () => void;
};

const ThemeModeContext = createContext<ThemeContextType | null>(null);

export function ThemeModeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<Mode>("light");

  const toggleTheme = () => {
    setMode(prev => (prev === "light" ? "dark" : "light"));
  };

  const theme = useMemo(() => createTheme({
    palette: { mode }
  }), [mode]);

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
  const context = useContext(ThemeModeContext);
  if (!context) throw new Error("useThemeMode must be used inside ThemeModeProvider");
  return context;
}
