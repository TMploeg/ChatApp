import { useContext } from "react";
import { NotificationContext } from "../context";
import { Variant } from "react-bootstrap/esm/types";
import {
  BsCheck2Circle,
  BsExclamationCircle,
  BsExclamationTriangle,
  BsInfoCircle,
} from "react-icons/bs";

export default function useAlert() {
  const notificationContext = useContext(NotificationContext);

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

    notificationContext.add({
      id: "alert_" + Date.now().toString(),
      title: message,
      variant: variant,
      icon,
    });
  };
}
