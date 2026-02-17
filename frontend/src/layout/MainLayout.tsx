import {
  AppBar,
  Box,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Switch,
  Toolbar,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useCallback, useEffect, useMemo, useState } from "react";

import DarkModeIcon from "@mui/icons-material/DarkMode";
import InventoryIcon from "@mui/icons-material/Inventory";
import LanguageIcon from "@mui/icons-material/Language";
import LogoutIcon from "@mui/icons-material/Logout";
import MenuIcon from "@mui/icons-material/Menu";

import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { clearToken } from "../auth/authStorage";
import { AUTH_EVENT } from "../auth/events";

import { useTranslation } from "react-i18next";
import { useThemeMode } from "../context/ThemeContext";
import { setAppLanguage } from "../i18n";

const drawerWidth = 260;

export default function MainLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const { mode, toggleTheme } = useThemeMode();
  const { t, i18n } = useTranslation();

  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));

  const activePath = useMemo(() => location.pathname, [location.pathname]);

  const handleLogout = useCallback(
    (reason?: string) => {
      clearToken();
      navigate("/login", { replace: true });
      if (reason) console.log("Logout:", reason);
    },
    [navigate]
  );

  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (detail?.type === "LOGOUT") {
        handleLogout(detail?.reason);
      }
    };

    window.addEventListener(AUTH_EVENT, handler as EventListener);
    return () => {
      window.removeEventListener(AUTH_EVENT, handler as EventListener);
    };
  }, [handleLogout]);

  const drawerContent = (
    <Box sx={{ width: drawerWidth }}>
      <Toolbar />
      <Divider />

      <List sx={{ pt: 1 }}>
        <ListItemButton
          selected={activePath.startsWith("/products")}
          onClick={() => {
            navigate("/products");
            setMobileOpen(false);
          }}
        >
          <ListItemIcon>
            <InventoryIcon />
          </ListItemIcon>
          <ListItemText primary={t("menu.products")} />
        </ListItemButton>

        <Divider sx={{ my: 1 }} />

        {/* Theme Switch */}
        <ListItemButton onClick={toggleTheme}>
          <ListItemIcon>
            <DarkModeIcon />
          </ListItemIcon>

          <ListItemText
            primary={t("menu.theme")}
            secondary={mode === "dark" ? "Dark" : "Light"}
          />

          <Switch
            checked={mode === "dark"}
            onClick={(e) => e.stopPropagation()}
            onChange={() => toggleTheme()}
          />
        </ListItemButton>


        {/* Language Switch */}
        <ListItemButton
          onClick={() => {
            const next = i18n.language === "fr" ? "en" : "fr";
            setAppLanguage(next);
            setMobileOpen(false);
          }}
        >
          <ListItemIcon>
            <LanguageIcon />
          </ListItemIcon>
          <ListItemText primary={t("menu.language")} secondary={i18n.language.toUpperCase()} />
        </ListItemButton>

        <Divider sx={{ my: 1 }} />

        <ListItemButton onClick={() => handleLogout("User logout")}>
          <ListItemIcon>
            <LogoutIcon />
          </ListItemIcon>
          <ListItemText primary={t("menu.logout")} />
        </ListItemButton>
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: "flex" }}>
      <AppBar
        position="fixed"
        sx={{
          zIndex: (t) => t.zIndex.drawer + 1,
        }}
      >
        <Toolbar>
          {!isDesktop && (
            <IconButton
              color="inherit"
              edge="start"
              onClick={() => setMobileOpen(true)}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
          )}

          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            {t("app.title")}
          </Typography>

          <IconButton color="inherit" onClick={() => handleLogout("AppBar logout")}>
            <LogoutIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      {isDesktop && (
        <Drawer
          variant="permanent"
          open
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            "& .MuiDrawer-paper": {
              width: drawerWidth,
              boxSizing: "border-box",
            },
          }}
        >
          {drawerContent}
        </Drawer>
      )}

      {!isDesktop && (
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
          ModalProps={{ keepMounted: true }}
          sx={{
            "& .MuiDrawer-paper": { width: drawerWidth },
          }}
        >
          {drawerContent}
        </Drawer>
      )}

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { md: `calc(100% - ${drawerWidth}px)` },
        }}
      >
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
}
