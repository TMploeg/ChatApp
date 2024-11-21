import { Variant } from "react-bootstrap/esm/types";
import { IconType } from "react-icons";

export default interface NotificationData {
  id: string;
  icon?: IconType;
  title: string;
  text?: string;
  variant?: Variant;
  onClick?: () => void;
}
