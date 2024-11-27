import { useEffect, useState } from "react";
import NotificationData from "./models/notification-data";
import {
  useCheckin,
  useConnectionRequests,
  useStorage,
  useWebSocket,
} from "./hooks";
import { JWT, Message } from "./models";
import { StorageLocation } from "./enums/StorageLocation";
import useNotification from "./hooks/useNotification";
import AppContext from "./AppContext";
import StompBroker from "./enums/StompBroker";
import { ConnectionRequest } from "./models/connection-request";
import App from "./App";
import ConnectionRequestState from "./enums/ConnectionRequestState";
import { BsChatFill } from "react-icons/bs";
import ChatGroup, { ChatGroupData } from "./models/chat-group";

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
  const getCheckinData = useCheckin();

  const { getConnectionRequestNotification } = useNotification();
  const { updateState } = useConnectionRequests();

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
    <AppContext.Provider
      value={{
        notifications: {
          data: notifications,
          add: handleNewNotification,
        },
        subscriptions: {
          chat: {
            subscribe: (id, callback) =>
              addSubscriptionMapping(id, callback, SubscriptionName.CHAT),
          },
          connectionRequests: {
            subscribe: (id, callback) =>
              addSubscriptionMapping(
                id,
                callback,
                SubscriptionName.CONNECTION_REQUESTS
              ),
          },
          chatGroups: {
            subscribe: (id, callback) =>
              addSubscriptionMapping(
                id,
                callback,
                SubscriptionName.CHAT_GROUPS
              ),
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

  function handleConnected() {
    setConnected(true);

    enableListeners();
    getCheckinData().then((data) =>
      setNotifications(
        data.newConnectionRequests.map(getConnectionRequestNotification)
      )
    );
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

        handleNewNotification(getConnectionRequestNotification(request));

        if (
          request.state.toUpperCase() ===
          ConnectionRequestState.SEND.toUpperCase()
        ) {
          updateState(request, ConnectionRequestState.SEEN);
        }
      }
    );

    socket.subscribe<ChatGroupData>(StompBroker.CHAT_GROUPS, (groupData) => {
      const group = new ChatGroup(groupData);
      console.log("NEW GROUP: ", groupData);
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

enum SubscriptionName {
  CHAT = "CHAT",
  CONNECTION_REQUESTS = "CONNECTION_REQUESTS",
  CHAT_GROUPS = "CHAT_GROUPS",
}
