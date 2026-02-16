export type ToastVariant = "success" | "error" | "warning" | "info";

export type ToastPayload = {
  message: string;
  variant?: ToastVariant;
};

const TOAST_EVENT = "app:toast";

export function emitToast(payload: ToastPayload) {
  window.dispatchEvent(new CustomEvent(TOAST_EVENT, { detail: payload }));
}

export function onToast(handler: (p: ToastPayload) => void) {
  const listener = (e: Event) => handler((e as CustomEvent).detail as ToastPayload);
  window.addEventListener(TOAST_EVENT, listener);
  return () => window.removeEventListener(TOAST_EVENT, listener);
}
