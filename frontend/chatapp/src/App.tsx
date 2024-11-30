import { useContext, useEffect, useState } from "react";
import Toolbar from "./components/toolbar/Toolbar";
import "./App.scss";
import Notification from "./components/notifications/Notification";
import { ToastContainer } from "react-bootstrap";
import {
  NotificationContext,
  Subscription,
  SubscriptionContext,
} from "./context";
import ChatMenu from "./components/chat-menu/ChatMenu";
import Routing from "./Routing";
import useNotification from "./hooks/useNotification";
import NotificationData from "./models/notification-data";
import { useApi } from "./hooks";
import StompBroker from "./enums/StompBroker";
import { ConnectionRequest } from "./models/connection-request";
import ConnectionsOverlay from "./components/connections/ConnectionsOverlay";
import ConnectionRequestsOverlay from "./components/connection-requests/ConnectionRequestsOverlay";
import Connection from "./models/connection";
import Page from "./models/page";
import ApiRoute from "./enums/ApiRoute";
import ConnectionRequestState from "./enums/ConnectionRequestState";
import ConnectionRequestDirection from "./enums/ConnectionRequestDirection";

const VISIBLE_CONNECTION_REQUEST_STATES: ConnectionRequestState[] = [
  ConnectionRequestState.SEND,
  ConnectionRequestState.SEEN,
];

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
  const subscriptions = useContext(SubscriptionContext);

  const [connectionRequests, setConnectionRequests] =
    useState<ConnectionRequest[]>();
  const [connections, setConnections] = useState<Connection[]>();

  const [connectionsVisible, setConnectionsVisible] = useState<boolean>(false);
  const [connectionRequestsVisible, setConnectionRequestsVisible] =
    useState<boolean>(false);

  const { getConnectionRequestNotification } = useNotification();

  const { get } = useApi();

  useEffect(() => {
    if (!loggedIn) {
      return;
    }

    fetchConnectionRequests();
    fetchConnections();

    return () => {
      setConnectionRequests(undefined);
      setConnections(undefined);
    };
  }, [loggedIn]);

  useEffect(() => {
    if (!connected) {
      return;
    }

    const subscription = subscribeToConnectionRequests();

    return () => subscription.unsubscribe();
  }, [connected]);

  return (
    <div className="app-container">
      <Toolbar
        title="ChatApp"
        loggedIn={loggedIn}
        onLogout={onLogout}
        onShowConnections={() => setConnectionsVisible(true)}
        onShowConnectionRequests={() => setConnectionRequestsVisible(true)}
      />
      <div className="app">
        {loggedIn && (
          <div className="app-menu">
            <ChatMenu connected={connected} />
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
      {connections && (
        <ConnectionsOverlay
          show={connectionsVisible}
          onHide={() => setConnectionsVisible(false)}
          connections={connections ?? []}
        />
      )}
      {connectionRequests && (
        <ConnectionRequestsOverlay
          show={connectionRequestsVisible}
          onHide={() => setConnectionRequestsVisible(false)}
          connectionRequests={connectionRequests}
          onRequestRemoved={removeConnectionRequest}
        />
      )}
    </div>
  );

  function subscribeToConnectionRequests(): Subscription {
    return subscriptions.subscribe<ConnectionRequest>(
      StompBroker.CONNECTION_REQUESTS,
      (request) => {
        switch (request.state.toUpperCase()) {
          case ConnectionRequestState.SEND.toUpperCase():
            setConnectionRequests((requests) => {
              requests?.unshift(request);
              return requests;
            });
            break;
          case ConnectionRequestState.ACCEPTED.toUpperCase():
            setConnections((connections) => {
              connections?.unshift({ username: request.subject });
              return connections;
            });
            break;
          default:
            break;
        }

        showRequestNotification(request);
      }
    );
  }

  function fetchConnectionRequests() {
    get<Page<ConnectionRequest>>(ApiRoute.CONNECTION_REQUESTS(), {
      state: VISIBLE_CONNECTION_REQUEST_STATES.join(","),
      direction: ConnectionRequestDirection.RECEIVED,
    }).then((requests) => {
      requests.page
        .filter((request) => request.state === ConnectionRequestState.SEND)
        .forEach((request) => {
          onNewNotification(
            getConnectionRequestNotification(request, {
              onClick: () => setConnectionRequestsVisible(true),
            })
          );
        });

      setConnectionRequests(requests.page);
    });
  }

  function fetchConnections() {
    get<Connection[]>(ApiRoute.CONNECTIONS()).then(setConnections);
  }

  function removeConnectionRequest(request: ConnectionRequest) {
    setConnectionRequests((requests) => {
      if (!requests) {
        return;
      }

      const index = requests.findIndex((r) => r.id === request.id);

      if (index < 0) {
        return requests;
      }

      return requests.slice(0, index).concat(requests.slice(index + 1));
    });
  }

  function showRequestNotification(request: ConnectionRequest) {
    const notification: NotificationData = getConnectionRequestNotification(
      request,
      {
        onClick: () => setConnectionRequestsVisible(true),
      }
    );

    onNewNotification(notification);
  }
}
