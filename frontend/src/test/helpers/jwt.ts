function base64UrlEncode(obj: any) {
  const json = JSON.stringify(obj);
  const base64 = btoa(unescape(encodeURIComponent(json)));
  return base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

export function makeJwt(payload: Record<string, any>) {
  const header = { alg: "HS256", typ: "JWT" };
  const h = base64UrlEncode(header);
  const p = base64UrlEncode(payload);
  return `${h}.${p}.signature`;
}