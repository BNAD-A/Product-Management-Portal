import { ReactNode } from "react";
import { Box, AppBar, Toolbar, Typography, Button } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { useApolloClient } from "@apollo/client";
import { useMe } from "../state/useMe";

type Props = {
  children: ReactNode;
};

export default function Layout({ children }: Props) {
  const navigate = useNavigate();
  const client = useApolloClient();
  const { me } = useMe();

  const logout = async () => {
    localStorage.removeItem("token"); // JWT
    await client.clearStore();
    navigate("/login");
  };

  return (
    <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      {/* HEADER */}
      <AppBar position="static">
        <Toolbar sx={{ display: "flex", gap: 2 }}>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            PreProject
          </Typography>

          <Button color="inherit" component={Link} to="/products">
            Products
          </Button>

          {me?.role === "ADMIN" && (
            <Button color="inherit" component={Link} to="/admin/users">
              Users
            </Button>
          )}

          <Typography sx={{ ml: 2 }}>
            {me?.username} ({me?.role})
          </Typography>

          <Button color="inherit" onClick={logout}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      {/* CONTENT */}
      <Box sx={{ flexGrow: 1, p: 3 }}>{children}</Box>
    </Box>
  );
}
