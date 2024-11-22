import { createContext } from "react";
import NotificationData from "./models/notification-data";
import { Message } from "./models";

const AppContext = createContext<AppContextData>(getDefaultContextData());

export default AppContext;

function getDefaultContextData(): AppContextData {
  return {
    notifications: {
      data: [],
      add: contextNotSetError,
    },
    subscriptions: {
      subscribeToChatGroup: () => {
        contextNotSetError();
        return {
          unsubscribe: contextNotSetError,
        };
      },
    },
  };
}

function contextNotSetError() {
  console.error("context not set");
}

interface AppContextData {
  notifications: CollectionContextData<NotificationData>;
  subscriptions: StompSubscriptionContextData;
}

interface CollectionContextData<TData> {
  data: TData[];
  add: (notification: TData) => void;
}

interface StompSubscriptionContextData {
  subscribeToChatGroup: (
    groupId: string,
    callBack: (message: Message) => void
  ) => Subscription;
}

interface Subscription {
  unsubscribe: () => void;
}
