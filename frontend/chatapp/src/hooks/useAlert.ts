import { useContext } from "react";
import AppContext from "../AppContext";
import { Variant } from "react-bootstrap/esm/types";
import {
  BsCheck2Circle,
  BsExclamationCircle,
  BsExclamationTriangle,
  BsInfoCircle,
} from "react-icons/bs";

export default function useAlert() {
  const { notifications } = useContext(AppContext);

  return function alert(message: string, variant: Variant) {
    const icon =
      variant === "success"
        ? BsCheck2Circle
        : variant === "danger"
        ? BsExclamationCircle
        : variant === "warning"
        ? BsExclamationTriangle
        : variant === "info"
        ? BsInfoCircle
        : undefined;

    notifications.add({
      id: "alert_" + Date.now().toString(),
      title: message,
      variant: variant,
      icon,
    });
  };
}
