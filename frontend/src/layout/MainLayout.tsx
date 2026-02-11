import { useEffect, useMemo, useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Drawer,
  List,
  ListItemButton,
  ListItemText,
  ListItemIcon,
  Switch,
  Box,
  Divider,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";

import MenuIcon from "@mui/icons-material/Menu";
import InventoryIcon from "@mui/icons-material/Inventory";
import LogoutIcon from "@mui/icons-material/Logout";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LanguageIcon from "@mui/icons-material/Language";

import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useThemeMode } from "../context/ThemeContext";
import { clearToken } from "../auth/token";
import { AUTH_EVENT } from "../auth/events";

const drawerWidth = 260;

export default function MainLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const { mode, toggleTheme } = useThemeMode();

  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));

  const activePath = useMemo(() => location.pathname, [location.pathname]);

  const handleLogout = (reason?: string) => {
    clearToken();
    navigate("/login", { replace: true });
    if (reason) console.log("Logout:", reason);
  };

  // Auto-logout listener (from Apollo errorLink)
  useEffect(() => {
    const handler = (e: Event) => {
      // @ts-ignore
      const detail = (e as CustomEvent).detail;
      if (detail?.type === "LOGOUT") handleLogout(detail?.reason);
    };

    window.addEventListener(AUTH_EVENT, handler as EventListener);
    return () => window.removeEventListener(AUTH_EVENT, handler as EventListener);
  }, []);

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
          <ListItemText primary="Products" />
        </ListItemButton>

        <Divider sx={{ my: 1 }} />

        {/* Theme */}
        <ListItemButton onClick={toggleTheme}>
          <ListItemIcon>
            <DarkModeIcon />
          </ListItemIcon>
          <ListItemText primary="Theme" secondary={mode === "dark" ? "Dark" : "Light"} />
          <Switch checked={mode === "dark"} onChange={toggleTheme} />
        </ListItemButton>

        {/* Language placeholder */}
        <ListItemButton
          onClick={() => {
            // US-12 branchera i18n ici
            alert("Language switch will be implemented in US-12 (i18n).");
          }}
        >
          <ListItemIcon>
            <LanguageIcon />
          </ListItemIcon>
          <ListItemText primary="Language" secondary="US-12" />
        </ListItemButton>

        <Divider sx={{ my: 1 }} />

        {/* Logout */}
        <ListItemButton onClick={() => handleLogout("User logout")}>
          <ListItemIcon>
            <LogoutIcon />
          </ListItemIcon>
          <ListItemText primary="Logout" />
        </ListItemButton>
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: "flex" }}>
      {/* APPBAR */}
      <AppBar
        position="fixed"
        sx={{
          zIndex: (t) => t.zIndex.drawer + 1,
        }}
      >
        <Toolbar>
          {!isDesktop && (
            <IconButton color="inherit" edge="start" onClick={() => setMobileOpen(true)} sx={{ mr: 2 }}>
              <MenuIcon />
            </IconButton>
          )}

          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            PreProject
          </Typography>

          <IconButton color="inherit" onClick={() => handleLogout("AppBar logout")}>
            <LogoutIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* DRAWER DESKTOP (permanent) */}
      {isDesktop && (
        <Drawer
          variant="permanent"
          open
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            "& .MuiDrawer-paper": { width: drawerWidth, boxSizing: "border-box" },
          }}
        >
          {drawerContent}
        </Drawer>
      )}

      {/* DRAWER MOBILE (temporary) */}
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

      {/* CONTENT */}
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
