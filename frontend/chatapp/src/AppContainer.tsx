import { useEffect, useState } from "react";
import NotificationData from "./models/notification-data";
import { useStorage, useWebSocket } from "./hooks";
import { JWT, Message } from "./models";
import { StorageLocation } from "./enums/StorageLocation";
import StompBroker from "./enums/StompBroker";
import { ConnectionRequest } from "./models/connection-request";
import App from "./App";
import { BsChatFill } from "react-icons/bs";
import ChatGroup, { ChatGroupData } from "./models/chat-group";
import SubscriptionName from "./enums/SubscriptionName";
import ContextProviders from "./ContextProviders";

const DEBUG_ENABLED: boolean = false;
const MAX_NOTIFICATIONS: number = 5;

export default function AppContainer() {
  const { get: getToken, set: setToken } = useStorage<JWT>(StorageLocation.JWT);

  const [connected, setConnected] = useState<boolean>(false);
  const [loggedIn, setLoggedIn] = useState<boolean>(!!getToken());
  const [notifications, setNotifications] = useState<NotificationData[]>([]);
  const [subscriptionMapping, setSubscriptionMapping] =
    useState<SubscriptionMapping>({
      CHAT: {},
      CONNECTION_REQUESTS: {},
      CHAT_GROUPS: {},
    });

  const socket = useWebSocket();

  useEffect(() => {
    if (loggedIn === connected) {
      return;
    }

    if (!loggedIn) {
      socket.disconnect();
      return;
    }

    socket.connect({
      enableDebug: DEBUG_ENABLED,
      onConnect: handleConnected,
      onDisconnect: handleDisconnected,
    });
  }, [loggedIn]);

  return (
    <ContextProviders
      notifications={notifications}
      onNotificationAdded={handleNewNotification}
      onSubscribed={addSubscriptionMapping}
    >
      <App
        loggedIn={loggedIn}
        connected={connected}
        onLogin={() => setLoggedIn(true)}
        onLogout={() => {
          setToken(null);
          setLoggedIn(false);
        }}
        onNewNotification={handleNewNotification}
      />
    </ContextProviders>
  );

  function handleConnected() {
    setConnected(true);

    enableListeners();
  }

  function handleDisconnected() {
    setConnected(false);

    clearNotifications();
    clearSubscriptionMappings();
  }

  function clearNotifications() {
    setNotifications([]);
  }

  function enableListeners() {
    socket.subscribe<Message>(StompBroker.CHAT, (message) =>
      subscriptionMapping.CHAT[message.groupId]?.(message)
    );

    socket.subscribe<ConnectionRequest>(
      StompBroker.CONNECTION_REQUESTS,
      (request) => {
        Object.values(subscriptionMapping.CONNECTION_REQUESTS).forEach(
          (subscription) => subscription(request)
        );
      }
    );

    socket.subscribe<ChatGroupData>(StompBroker.CHAT_GROUPS, (groupData) => {
      const group = new ChatGroup(groupData);

      Object.values(subscriptionMapping.CHAT_GROUPS).forEach((subscription) =>
        subscription(group)
      );

      handleNewNotification({
        id: "newgroup_" + group.getId(),
        title: "Chat Groups",
        icon: BsChatFill,
        text: `New chat group: '${group.getName()}'`,
        variant: "primary",
      });
    });
  }

  function addSubscriptionMapping<TData>(
    id: string,
    callback: (data: TData) => void,
    subscriptionName: SubscriptionName
  ) {
    setSubscriptionMapping((mapping) => {
      const subscription = mapping[subscriptionName];
      if (subscription[id]) {
        console.error("duplicate subscription mapping");
      }
      subscription[id] = callback;

      const newMapping = { ...mapping };
      newMapping[subscriptionName] = subscription;
      return newMapping;
    });

    return {
      unsubscribe: () =>
        setSubscriptionMapping((mapping) => {
          const subscription = mapping[subscriptionName];
          if (!subscription[id]) {
            return mapping;
          }

          delete subscription[id];

          const newMapping = { ...mapping };
          mapping[subscriptionName] = subscription;

          return newMapping;
        }),
    };
  }

  function clearSubscriptionMappings() {
    setSubscriptionMapping({
      CHAT: {},
      CONNECTION_REQUESTS: {},
      CHAT_GROUPS: {},
    });
  }

  function handleNewNotification(notification: NotificationData) {
    setNotifications((notifications) => {
      const remainingNotificationSlots: number =
        MAX_NOTIFICATIONS - notifications.length;

      if (remainingNotificationSlots > 0) {
        return [...notifications, notification];
      }

      return [
        ...notifications.slice(Math.abs(remainingNotificationSlots) + 1),
        notification,
      ];
    });
  }
}

type SubscriptionMapping = Record<
  keyof typeof SubscriptionName,
  Record<string, (data: any) => void>
>;
