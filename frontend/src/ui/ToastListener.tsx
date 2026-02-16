import { useEffect } from "react";
import { useSnackbar } from "notistack";
import { onToast } from "./toastBus";

export default function ToastListener() {
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    return onToast(({ message, variant }) => {
      enqueueSnackbar(message, { variant: variant ?? "info" });
    });
  }, [enqueueSnackbar]);

  return null;
}
