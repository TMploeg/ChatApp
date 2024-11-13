import { createContext } from "react";
import NotificationData from "./models/notification-data";

export interface AppContextData {
  addNotification: (notification: NotificationData) => void;
}

const AppContext = createContext<AppContextData>({
  addNotification: () => console.error("context not set"),
});

export default AppContext;
