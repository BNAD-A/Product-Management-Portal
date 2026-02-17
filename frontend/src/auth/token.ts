import { getToken } from "./authStorage";

export type JwtPayload = {
  exp?: number;
  userId?: string | number;
  username?: string;
  role?: "ADMIN" | "USER" | string;
  [key: string]: unknown;
};

function base64UrlDecodeToUnknown(str: string): unknown {
  const pad = str.length % 4 === 0 ? "" : "=".repeat(4 - (str.length % 4));
  const b64 = (str + pad).replace(/-/g, "+").replace(/_/g, "/");
  const json = decodeURIComponent(
    atob(b64)
      .split("")
      .map((c) => "%" + c.charCodeAt(0).toString(16).padStart(2, "0"))
      .join("")
  );

  return JSON.parse(json) as unknown;
}

export function getTokenPayload(): JwtPayload | null {
  const token = getToken();
  if (!token) return null;

  const parts = token.split(".");
  if (parts.length < 2) return null;

  try {
    const decoded = base64UrlDecodeToUnknown(parts[1]);
    if (decoded && typeof decoded === "object") return decoded as JwtPayload;
    return null;
  } catch {
    return null;
  }
}

export function isTokenValid(): boolean {
  const payload = getTokenPayload();
  if (!payload?.exp) return false;
  return payload.exp > Math.floor(Date.now() / 1000);
}
