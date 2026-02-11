export const AUTH_EVENT = "pp_auth_event";

export type AuthEventPayload = {
  type: "LOGOUT";
  reason?: string;
};

export function emitLogout(reason?: string) {
  const payload: AuthEventPayload = { type: "LOGOUT", reason };
  window.dispatchEvent(new CustomEvent(AUTH_EVENT, { detail: payload }));
}
