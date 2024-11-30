import { useEffect, useState } from "react";
import NotificationData from "./models/notification-data";
import { useStorage, useWebSocket } from "./hooks";
import { JWT } from "./models";
import { StorageLocation } from "./enums/StorageLocation";
import App from "./App";
import ContextProviders from "./ContextProviders";

const DEBUG_ENABLED: boolean = false;
const MAX_NOTIFICATIONS: number = 5;

export default function AppContainer() {
  const { get: getToken, set: setToken } = useStorage<JWT>(StorageLocation.JWT);

  const [connected, setConnected] = useState<boolean>(false);
  const [loggedIn, setLoggedIn] = useState<boolean>(!!getToken());
  const [notifications, setNotifications] = useState<NotificationData[]>([]);

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
      onSubscribe={socket.subscribe}
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
  }

  function handleDisconnected() {
    setConnected(false);

    clearNotifications();
  }

  function clearNotifications() {
    setNotifications([]);
  }

  // function enableListeners() {
  //   socket.subscribe<Message>(StompBroker.CHAT, (message) =>
  //     subscriptionMapping.CHAT[message.groupId]?.(message)
  //   );

  //   socket.subscribe<ConnectionRequest>(
  //     StompBroker.CONNECTION_REQUESTS,
  //     (request) => {
  //       Object.values(subscriptionMapping.CONNECTION_REQUESTS).forEach(
  //         (subscription) => subscription(request)
  //       );
  //     }
  //   );

  //   socket.subscribe<ChatGroupData>(StompBroker.CHAT_GROUPS, (groupData) => {
  //     const group = new ChatGroup(groupData);

  //     handleNewNotification({
  //       id: "newgroup_" + group.getId(),
  //       title: "Chat Groups",
  //       icon: BsChatFill,
  //       text: `New chat group: '${group.getName()}'`,
  //       variant: "primary",
  //     });
  //   });
  // }

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
