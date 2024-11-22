import { useEffect, useState } from "react";
import NotificationData from "./models/notification-data";
import { useCheckin, useStorage, useWebSocket } from "./hooks";
import { JWT, Message } from "./models";
import { StorageLocation } from "./enums/StorageLocation";
import useNotification from "./hooks/useNotification";
import AppContext from "./AppContext";
import StompBroker from "./enums/StompBroker";
import { ConnectionRequest } from "./models/connection-requests";
import App from "./App";

const DEBUG_ENABLED: boolean = false;
const MAX_NOTIFICATIONS: number = 5;

export default function AppContainer() {
  const { get: getToken, set: setToken } = useStorage<JWT>(StorageLocation.JWT);

  const [connected, setConnected] = useState<boolean>(false);
  const [loggedIn, setLoggedIn] = useState<boolean>(!!getToken());
  const [notifications, setNotifications] = useState<NotificationData[]>([]);
  const [chatSubscriptionMapping, setChatSubscriptionMapping] =
    useState<ChatSubscriptionMapping>({});

  const socket = useWebSocket();
  const checkin = useCheckin();

  const { getConnectionRequestNotification } = useNotification();

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

    return () => socket.disconnect();
  }, [loggedIn]);

  return (
    <AppContext.Provider
      value={{
        notifications: {
          data: notifications,
          add: handleNewNotification,
        },
        subscriptions: {
          subscribeToChatGroup: (groupId, callback) => {
            setChatSubscriptionMapping((mapping) => {
              mapping[groupId] = callback;
              return mapping;
            });
            return {
              unsubscribe: () =>
                setChatSubscriptionMapping((mapping) => {
                  if (mapping[groupId]) {
                    delete mapping[groupId];
                  }

                  return mapping;
                }),
            };
          },
        },
      }}
    >
      <App
        loggedIn={loggedIn}
        connected={connected}
        onLogin={() => setLoggedIn(true)}
        onLogout={() => {
          setToken(null);
          setLoggedIn(false);
        }}
      />
    </AppContext.Provider>
  );

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

  function handleConnected() {
    setConnected(true);

    enableChatMessageListener();
    enableConnectionRequestListener();
    checkin();
  }

  function handleDisconnected() {
    setConnected(false);

    clearNotifications();
  }

  function clearNotifications() {
    setNotifications([]);
  }

  function enableChatMessageListener() {
    socket.subscribe<Message>(StompBroker.CHAT, (message) =>
      chatSubscriptionMapping[message.groupId]?.(message)
    );
  }

  function enableConnectionRequestListener() {
    socket.subscribe<ConnectionRequest>(
      StompBroker.CONNECTION_REQUESTS,
      (request) =>
        handleNewNotification(getConnectionRequestNotification(request))
    );
  }

  type ChatSubscriptionMapping = Record<string, (data: Message) => void>;
}
