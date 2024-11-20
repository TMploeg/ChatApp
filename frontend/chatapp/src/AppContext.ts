import { createContext } from "react";
import NotificationData from "./models/notification-data";

export interface AppContextData {
  notifications: NotificationContextData;
}
export interface NotificationContextData {
  add: (notification: NotificationData) => void;
  init: () => void;
}

const AppContext = createContext<AppContextData>({
  notifications: {
    add: () => console.error("context not set"),
    init: () => console.error("context not set"),
  },
});

export default AppContext;
