import { createContext } from "react";
import NotificationData from "./models/notification-data";

export interface AppContextData {
  notifications: CollectionContextData<NotificationData>;
}
interface CollectionContextData<TData> {
  data?: TData[];
  add: (notification: TData) => void;
  init: () => void;
  clear?: () => void;
}

const AppContext = createContext<AppContextData>({
  notifications: {
    add: contextNotSetError,
    init: contextNotSetError,
  },
});

function contextNotSetError() {
  console.error("context not set");
}

export default AppContext;
