import { useContext, useEffect } from "react";
import Toolbar from "./components/toolbar/Toolbar";
import "./App.scss";
import Notification from "./components/notifications/Notification";
import { ToastContainer } from "react-bootstrap";
import {
  ConnectionRequestContext,
  ConnectionRequestsVisibilityContext,
  NotificationContext,
  Subscription,
} from "./context";
import ChatMenu from "./components/chat-menu/ChatMenu";
import Routing from "./Routing";
import useNotification from "./hooks/useNotification";
import NotificationData from "./models/notification-data";
import { useCheckin } from "./hooks";

interface AppProps {
  loggedIn: boolean;
  connected: boolean;
  onLogin: () => void;
  onLogout: () => void;
  onNewNotification: (notification: NotificationData) => void;
}
export default function App({
  loggedIn,
  connected,
  onLogin,
  onLogout,
  onNewNotification,
}: AppProps) {
  const notifications = useContext(NotificationContext);
  const connectionRequests = useContext(ConnectionRequestContext);
  const connectionRequestsVisibility = useContext(
    ConnectionRequestsVisibilityContext
  );

  const { getConnectionRequestNotification } = useNotification();
  const getCheckinData = useCheckin();

  useEffect(() => {
    if (!loggedIn) {
      return;
    }

    const subscription = subscribeToConnectionRequests();

    getCheckinData().then((data) => {
      data.newConnectionRequests
        .map((request) =>
          getConnectionRequestNotification(request, {
            onClick: connectionRequestsVisibility.show,
          })
        )
        .forEach(onNewNotification);
    });

    return () => subscription.unsubscribe();
  }, [loggedIn]);
  return (
    <div className="app-container">
      <Toolbar title="ChatApp" loggedIn={loggedIn} onLogout={onLogout} />
      <div className="app">
        {loggedIn && (
          <div className="app-menu">
            <ChatMenu />
          </div>
        )}
        <div className="app-content">
          <Routing
            loggedIn={loggedIn}
            connected={connected}
            onLogin={onLogin}
          />
        </div>
      </div>
      <ToastContainer className="notification-container" position="bottom-end">
        {notifications.notifications.map((notification) => (
          <Notification key={notification.id} notification={notification} />
        ))}
      </ToastContainer>
    </div>
  );

  function subscribeToConnectionRequests(): Subscription {
    return connectionRequests.subscribe("App", (request) => {
      const notification: NotificationData = getConnectionRequestNotification(
        request,
        {
          onClick: connectionRequestsVisibility.show,
        }
      );

      onNewNotification(notification);
    });
  }
}
