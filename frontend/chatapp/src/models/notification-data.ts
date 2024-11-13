import { Color } from "react-bootstrap/esm/types";
import { IconType } from "react-icons";

export default interface NotificationData {
  id: string;
  icon: IconType;
  title: string;
  text: string;
  actions?: { [key: string]: NotificationAction };
}

export interface NotificationAction {
  type: Color;
  onClick: () => void;
}
