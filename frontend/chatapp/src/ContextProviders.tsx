import { useState } from "react";
import {
  NotificationContext,
  SubscriptionContext,
  Subscription,
  NotificationContextData,
  SubscriptionContextData,
  ConnectionsVisibilityContext,
  ConnectionRequestsVisibilityContext,
  VisibilityContextData,
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
  const [connectionsVisible, setConnectionsVisible] = useState<boolean>(false);
  const [connectionRequestsVisible, setConnectionRequestsVisible] =
    useState<boolean>(false);

  return (
    <NotificationContext.Provider value={notificationContextValue()}>
      <SubscriptionContext.Provider value={subscriptionContextValue()}>
        <ConnectionsVisibilityContext.Provider
          value={connectionsVisibilityContextValue()}
        >
          <ConnectionRequestsVisibilityContext.Provider
            value={connectionRequestsVisibilityContextData()}
          >
            {children}
          </ConnectionRequestsVisibilityContext.Provider>
        </ConnectionsVisibilityContext.Provider>
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

  function connectionsVisibilityContextValue(): VisibilityContextData {
    return {
      visible: connectionsVisible,
      show: () => setConnectionsVisible(true),
      hide: () => setConnectionsVisible(false),
    };
  }

  function connectionRequestsVisibilityContextData(): VisibilityContextData {
    return {
      visible: connectionRequestsVisible,
      show: () => setConnectionRequestsVisible(true),
      hide: () => setConnectionRequestsVisible(false),
    };
  }
}
