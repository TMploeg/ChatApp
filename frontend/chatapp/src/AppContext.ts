import { createContext } from "react";
import NotificationData from "./models/notification-data";
import { Message } from "./models";
import { ConnectionRequest } from "./models/connection-request";
import { ChatGroupData } from "./models/chat-group";

const AppContext = createContext<AppContextData>(getDefaultContextData());

export default AppContext;

function getDefaultContextData(): AppContextData {
  return {
    notifications: {
      data: [],
      add: contextNotSetError,
    },
    subscriptions: {
      chat: {
        subscribe: () => {
          contextNotSetError();
          return {
            unsubscribe: contextNotSetError,
          };
        },
      },
      connectionRequests: {
        subscribe: () => {
          contextNotSetError();
          return {
            unsubscribe: contextNotSetError,
          };
        },
      },
      chatGroups: {
        subscribe: () => {
          contextNotSetError();
          return {
            unsubscribe: contextNotSetError,
          };
        },
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
  chat: SubscribeFunc<Message>;
  connectionRequests: SubscribeFunc<ConnectionRequest>;
  chatGroups: SubscribeFunc<ChatGroupData>;
}

interface SubscribeFunc<TData> {
  subscribe: (id: string, callback: (data: TData) => void) => Subscription;
}

interface Subscription {
  unsubscribe: () => void;
}
