import { createContext } from "react";
import NotificationData from "./models/notification-data";
import StompBroker from "./enums/StompBroker";

const DEFAULT_NOTIFICATION_CONTEXT_DATA: NotificationContextData = {
  notifications: [],
  add: () => contextNotSetError("notifications.add"),
};
const DEFAULT_SUBSCRIPTION_CONTEXT_DATA: SubscriptionContextData = {
  subscribe: () => {
    contextNotSetError("subscription.subscribe");
    return {
      unsubscribe: () => contextNotSetError("subscription.unsubscribe"),
    };
  },
};
const DEFAULT_CHANGE_HANDLER_CONTEXT_DATA: ChangeHandlerContextData = {
  onChange: contextNotSetError,
  subscribe: () => {
    contextNotSetError("changeHandler.subscribe");
    return {
      unsubscribe: () => contextNotSetError("changeHandler.unsubscribe"),
    };
  },
};

function contextNotSetError(name?: string) {
  throw new Error(`context not set ('${name ?? "unknown"}')`);
}

export const NotificationContext = createContext<NotificationContextData>(
  DEFAULT_NOTIFICATION_CONTEXT_DATA
);

export const SubscriptionContext = createContext<SubscriptionContextData>(
  DEFAULT_SUBSCRIPTION_CONTEXT_DATA
);

export const ChangeHandlerContext = createContext<ChangeHandlerContextData>(
  DEFAULT_CHANGE_HANDLER_CONTEXT_DATA
);

export interface NotificationContextData {
  notifications: NotificationData[];
  add: (notification: NotificationData) => void;
}

export interface SubscriptionContextData {
  subscribe: <TData>(
    broker: StompBroker,
    callback: (data: TData) => void
  ) => Subscription;
}

export interface Subscription {
  unsubscribe: () => void;
}

export interface ChangeHandlerContextData {
  onChange: (name: string, value: any) => void;
  subscribe: (name: string, handler: ChangeHandler) => Subscription;
}

export type ChangeHandler = (value: any) => void;
