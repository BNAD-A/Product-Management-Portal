import { Navigate } from "react-router-dom";
import { ReactNode } from "react";
import { Box, CircularProgress } from "@mui/material";
import { useMe } from "../state/useMe";

export function RequireAdmin({ children }: { children: ReactNode }) {
  const { me, loading } = useMe();

  if (loading) {
    return (
      <Box sx={{ minHeight: "60vh", display: "grid", placeItems: "center" }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!me) return <Navigate to="/login" replace />;
  if (me.role !== "ADMIN") return <Navigate to="/products" replace />;
  return <>{children}</>;
}
