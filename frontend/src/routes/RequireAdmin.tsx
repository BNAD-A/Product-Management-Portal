import { Navigate, Outlet } from "react-router-dom";
import { getToken } from "../auth/authStorage";

type JwtPayload = { role?: string };

function decodePayload(token: string): JwtPayload | null {
  try {
    const payloadPart = token.split(".")[1];
    if (!payloadPart) return null;

    // base64url -> base64
    const base64 = payloadPart.replace(/-/g, "+").replace(/_/g, "/");
    const json = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + c.charCodeAt(0).toString(16).padStart(2, "0"))
        .join("")
    );

    return JSON.parse(json);
  } catch {
    return null;
  }
}

export default function RequireAdmin() {
  const token = getToken();
  const payload = token ? decodePayload(token) : null;

  const isAdmin = payload?.role === "ADMIN";
  return isAdmin ? <Outlet /> : <Navigate to="/products" replace />;
}