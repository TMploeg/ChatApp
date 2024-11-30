import { useState } from "react";
import {
  NotificationContext,
  SubscriptionContext,
  Subscription,
  NotificationContextData,
  SubscriptionContextData,
} from "./context";
import NotificationData from "./models/notification-data";
import StompBroker from "./enums/StompBroker";

interface Props {
  children: any;
  notifications: NotificationData[];
  onSubscribe: <TData>(
    broker: StompBroker,
    callback: (data: TData) => void
  ) => Subscription;
  onNotificationAdded: (notification: NotificationData) => void;
}
export default function ContextProviders({
  children,
  notifications,
  onSubscribe,
  onNotificationAdded,
}: Props) {
  return (
    <NotificationContext.Provider value={notificationContextValue()}>
      <SubscriptionContext.Provider value={subscriptionContextValue()}>
        {children}
      </SubscriptionContext.Provider>
    </NotificationContext.Provider>
  );

  function notificationContextValue(): NotificationContextData {
    return {
      notifications,
      add: (notification) => onNotificationAdded(notification),
    };
  }

  function subscriptionContextValue(): SubscriptionContextData {
    return {
      subscribe: onSubscribe,
    };
  }
}
