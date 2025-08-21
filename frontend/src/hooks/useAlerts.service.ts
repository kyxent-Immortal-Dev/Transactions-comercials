import type { SweetAlertIcon, SweetAlertTheme } from "sweetalert2";
import Swal from "sweetalert2";

export const useAlertsService = () => {
  const showAlert = (
    title: string,
    theme: SweetAlertTheme,
    icon: SweetAlertIcon,
    text: string
  ) => {
    Swal.fire({
      title: title,
      text: text,
      icon: icon,
      theme: theme,
    });
  };

  return {
    showAlert,
  };
};
