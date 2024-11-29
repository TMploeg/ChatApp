import { createContext } from "react";
import NotificationData from "./models/notification-data";
import { Message } from "./models";
import { ConnectionRequest } from "./models/connection-request";
import { ChatGroupData } from "./models/chat-group";

const DEFAULT_CONTEXT_DATA = {
  notifications: {
    notifications: [],
    add: () => contextNotSetError("notifications.add"),
  },
  subscription: {
    subscribe: () => {
      contextNotSetError("subscription.subscribe");
      return {
        unsubscribe: () => contextNotSetError("subscription.unsubscribe"),
      };
    },
  },
  visibility: {
    visible: false,
    show: () => contextNotSetError("visibility.show"),
    hide: () => contextNotSetError("visibility.hide"),
  },
};

function contextNotSetError(name?: string) {
  throw new Error(`context not set ('${name ?? "unknown"}')`);
}

export const NotificationContext = createContext<NotificationContextData>(
  DEFAULT_CONTEXT_DATA.notifications
);

export const ChatContext = createContext<ChatContextData>(
  DEFAULT_CONTEXT_DATA.subscription
);

export const ConnectionRequestContext =
  createContext<ConnectionRequestsContextData>(
    DEFAULT_CONTEXT_DATA.subscription
  );

export const ChatGroupsContext = createContext<ChatGroupsContextData>(
  DEFAULT_CONTEXT_DATA.subscription
);

export const ConnectionsVisibilityContext =
  createContext<VisibilityContextData>(DEFAULT_CONTEXT_DATA.visibility);

export const ConnectionRequestsVisibilityContext =
  createContext<VisibilityContextData>(DEFAULT_CONTEXT_DATA.visibility);

export interface NotificationContextData {
  notifications: NotificationData[];
  add: (notification: NotificationData) => void;
}

export type ChatContextData = SubscriptionContextData<Message>;

export type ConnectionRequestsContextData =
  SubscriptionContextData<ConnectionRequest>;

export type ChatGroupsContextData = SubscriptionContextData<ChatGroupData>;

interface SubscriptionContextData<T> {
  subscribe: SubscribeFunc<T>;
}

type SubscribeFunc<TData> = (
  id: string,
  callback: (data: TData) => void
) => Subscription;

export interface Subscription {
  unsubscribe: () => void;
}

export interface VisibilityContextData {
  visible: boolean;
  show: () => void;
  hide: () => void;
}
