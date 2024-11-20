import { useEffect, useState } from "react";
import {
  useCheckin,
  useConnectionRequests,
  useStorage,
  useWebSocket,
} from "./hooks";
import { Navigate, Route, Routes } from "react-router-dom";
import { StorageLocation } from "./enums/StorageLocation";
import LoginPage from "./components/auth/login/LoginPage";
import GlobalChatPage from "./components/chat/global/GlobalChatPage";
import { JWT } from "./models/auth";
import Message from "./models/message";
import RegisterPage from "./components/auth/register/RegisterPage";
import HomePage from "./components/home/HomePage";
import Toolbar from "./components/toolbar/Toolbar";
import NavMenu from "./components/nav-menu/NavMenu";
import AppRoute from "./enums/AppRoute";
import "./App.scss";
import LoadingPage from "./components/page/LoadingPage";
import Notification from "./components/notifications/Notification";
import { ToastContainer } from "react-bootstrap";
import AppContext from "./AppContext";
import NotificationData from "./models/notification-data";
import ConnectionsPage from "./components/connections/ConnectionsPage";
import ConnectionRequestsPage from "./components/connection-requests/ConnectionRequestsPage";

const DEBUG_ENABLED: boolean = false;
const MAX_NOTIFICATIONS: number = 5;

interface Props {
  notifications?: NotificationData[];
  onDisconnect: () => void;
}
function App({ notifications, onDisconnect }: Props) {
  const { get: getToken, set: setToken } = useStorage<JWT>(StorageLocation.JWT);

  const [connected, setConnected] = useState<boolean>(false);
  const [loggedIn, setLoggedIn] = useState<boolean>(!!getToken());
  const [hasNewConnectionRequests, setHasNewConnectionRequests] =
    useState<boolean>(false);

  const socket = useWebSocket();

  const checkin = useCheckin();

  const { enableConnectionRequestListener } = useConnectionRequests(socket);

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
    <div className="app-container">
      <Toolbar
        title="ChatApp"
        loggedIn={loggedIn}
        onLogout={() => {
          setToken(null);
          setLoggedIn(false);
        }}
      />
      <div className="app">
        {loggedIn && (
          <div className="app-menu">
            <NavMenu
              notifications={{
                connections: hasNewConnectionRequests,
              }}
            />
          </div>
        )}
        <div className="app-content">{getRoutes()}</div>
      </div>
      <ToastContainer className="notification-container" position="bottom-end">
        {notifications &&
          notifications.map((notification) => (
            <Notification key={notification.id} notification={notification} />
          ))}
      </ToastContainer>
    </div>
  );

  function getRoutes() {
    return (
      <Routes>
        {loggedIn ? (
          <>
            <Route path={AppRoute.HOME} element={<HomePage />} />
            <Route
              path={AppRoute.GLOBAL_CHAT}
              element={
                <LoadingPage loaded={connected}>
                  <GlobalChatPage
                    subscribe={(destination, callback) =>
                      socket.subscribe<Message>(destination, callback)
                    }
                  />
                </LoadingPage>
              }
            />
            <Route
              path={AppRoute.CONNECTIONS}
              element={
                <ConnectionsPage
                  hasNewRequests={hasNewConnectionRequests}
                  onNewRequestsChecked={() =>
                    setHasNewConnectionRequests(false)
                  }
                />
              }
            />
            <Route
              path={AppRoute.CONNECTION_REQUESTS}
              element={<ConnectionRequestsPage />}
            />
          </>
        ) : (
          <>
            <Route
              path={AppRoute.HOME}
              element={<Navigate to={AppRoute.LOGIN} />}
            />
            <Route
              path={AppRoute.LOGIN}
              element={<LoginPage onLogin={() => setLoggedIn(true)} />}
            />
            <Route
              path={AppRoute.REGISTER}
              element={<RegisterPage onRegister={() => setLoggedIn(true)} />}
            />
          </>
        )}
        <Route path={AppRoute.ANY} element={<Navigate to={AppRoute.HOME} />} />
      </Routes>
    );
  }

  function handleConnected() {
    setConnected(true);

    enableConnectionRequestListener(() => setHasNewConnectionRequests(true));
    checkin();
  }

  function handleDisconnected() {
    setConnected(false);

    onDisconnect();
  }
}

export default function AppContainer() {
  const [notifications, setNotifications] = useState<NotificationData[]>();

  return (
    <AppContext.Provider
      value={{
        notifications: {
          add: handleNewNotification,
          init: () => setNotifications([]),
        },
      }}
    >
      <App
        notifications={notifications}
        onDisconnect={() => setNotifications(undefined)}
      />
    </AppContext.Provider>
  );

  function handleNewNotification(notification: NotificationData) {
    setNotifications((notifications) => {
      if (!notifications) {
        return undefined;
      }

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
