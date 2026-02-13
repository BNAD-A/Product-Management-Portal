import { getToken } from "./authStorage";

function base64UrlDecode(str: string) {
  const pad = str.length % 4 === 0 ? "" : "=".repeat(4 - (str.length % 4));
  const b64 = (str + pad).replace(/-/g, "+").replace(/_/g, "/");
  const json = decodeURIComponent(escape(atob(b64)));
  return JSON.parse(json);
}

export function getTokenPayload<T = any>(): T | null {
  const token = getToken();
  if (!token) return null;
  const parts = token.split(".");
  if (parts.length < 2) return null;
  try {
    return base64UrlDecode(parts[1]);
  } catch {
    return null;
  }
}

export function isTokenValid(): boolean {
  const payload: any = getTokenPayload();
  if (!payload?.exp) return false;
  return payload.exp > Math.floor(Date.now() / 1000);
}