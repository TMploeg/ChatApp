import { useState } from "react";
import {
  NotificationContext,
  ChatContext,
  ConnectionRequestContext,
  ChatGroupsContext,
  Subscription,
  NotificationContextData,
  ChatContextData,
  ConnectionRequestsContextData,
  ChatGroupsContextData,
  ConnectionsVisibilityContext,
  ConnectionRequestsVisibilityContext,
  VisibilityContextData,
} from "./context";
import SubscriptionName from "./enums/SubscriptionName";
import NotificationData from "./models/notification-data";

interface Props {
  children: any;
  notifications: NotificationData[];
  onSubscribed: (
    id: string,
    callback: (data: any) => void,
    subscriptionName: SubscriptionName
  ) => Subscription;
  onNotificationAdded: (notification: NotificationData) => void;
}
export default function ContextProviders({
  children,
  notifications,
  onSubscribed,
  onNotificationAdded,
}: Props) {
  const [connectionsVisible, setConnectionsVisible] = useState<boolean>(false);
  const [connectionRequestsVisible, setConnectionRequestsVisible] =
    useState<boolean>(false);

  return (
    <NotificationContext.Provider value={notificationContextValue()}>
      <ChatContext.Provider value={chatContextValue()}>
        <ConnectionRequestContext.Provider
          value={connectionRequestsContextValue()}
        >
          <ChatGroupsContext.Provider value={chatGroupsContextValue()}>
            <ConnectionsVisibilityContext.Provider
              value={connectionsVisibilityContextValue()}
            >
              <ConnectionRequestsVisibilityContext.Provider
                value={connectionRequestsVisibilityContextData()}
              >
                {children}
              </ConnectionRequestsVisibilityContext.Provider>
            </ConnectionsVisibilityContext.Provider>
          </ChatGroupsContext.Provider>
        </ConnectionRequestContext.Provider>
      </ChatContext.Provider>
    </NotificationContext.Provider>
  );

  function notificationContextValue(): NotificationContextData {
    return {
      notifications,
      add: (notification) => onNotificationAdded(notification),
    };
  }

  function chatContextValue(): ChatContextData {
    return {
      subscribe: (id, callback) =>
        onSubscribed(id, callback, SubscriptionName.CHAT),
    };
  }

  function connectionRequestsContextValue(): ConnectionRequestsContextData {
    return {
      subscribe: (id, callback) =>
        onSubscribed(id, callback, SubscriptionName.CONNECTION_REQUESTS),
    };
  }

  function chatGroupsContextValue(): ChatGroupsContextData {
    return {
      subscribe: (id, callback) =>
        onSubscribed(id, callback, SubscriptionName.CHAT_GROUPS),
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
