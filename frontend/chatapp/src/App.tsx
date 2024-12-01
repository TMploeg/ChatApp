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
import {
  AnsweredConnectionRequest,
  SendConnectionRequest,
} from "./models/connection-request";
import ConnectionsOverlay from "./components/connections/ConnectionsOverlay";
import ConnectionRequestsOverlay from "./components/connection-requests/ConnectionRequestsOverlay";
import Connection from "./models/connection";
import Page from "./models/page";
import ApiRoute from "./enums/ApiRoute";
import ConnectionRequestAnswerType from "./enums/ConnectionRequestAnswerType";

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

  const [connectionRequestsPage, setConnectionRequestsPage] =
    useState<Page<SendConnectionRequest>>();
  const [connections, setConnections] = useState<Connection[]>();

  const [connectionsVisible, setConnectionsVisible] = useState<boolean>(false);
  const [connectionRequestsVisible, setConnectionRequestsVisible] =
    useState<boolean>(false);

  const {
    getSendConnectionRequestNotification,
    getAnsweredConnectionRequestNotification,
  } = useNotification();

  const { get } = useApi();

  useEffect(() => {
    if (!loggedIn) {
      return;
    }

    fetchConnectionRequests();
    fetchConnections();

    return () => {
      setConnectionRequestsPage(undefined);
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
      {connectionRequestsPage && (
        <ConnectionRequestsOverlay
          show={connectionRequestsVisible}
          onHide={() => setConnectionRequestsVisible(false)}
          connectionRequests={connectionRequestsPage.page}
          onRequestAnswered={handleRequestAnswered}
          pagination={{
            page: connectionRequestsPage.meta.page,
            totalPages: connectionRequestsPage.meta.totalPages,
            onPrevious: previousConnectionRequestsPage,
            onNext: nextConnectionRequestsPage,
          }}
        />
      )}
    </div>
  );

  function subscribeToConnectionRequests(): Subscription {
    const sendRequestsSubscription =
      subscriptions.subscribe<SendConnectionRequest>(
        StompBroker.SEND_CONNECTION_REQUESTS,
        (request) => {
          addConnectionRequest(request);

          onNewNotification(
            getSendConnectionRequestNotification(request, {
              onClick: () => setConnectionRequestsVisible(true),
            })
          );
        }
      );

    const answeredRequestsSubscription =
      subscriptions.subscribe<AnsweredConnectionRequest>(
        StompBroker.ANSWERED_CONNECTION_REQUESTS,
        (request) => {
          if (request.accepted) {
            addConnection({ username: request.subject });
          }

          onNewNotification(
            getAnsweredConnectionRequestNotification(request, {
              onClick: request.accepted
                ? () => setConnectionsVisible(true)
                : undefined,
            })
          );
        }
      );

    return {
      unsubscribe: () => {
        sendRequestsSubscription.unsubscribe();
        answeredRequestsSubscription.unsubscribe();
      },
    };
  }

  function fetchConnectionRequests(page?: number) {
    get<Page<SendConnectionRequest>>(ApiRoute.CONNECTION_REQUESTS(), {
      page: page,
    }).then((requests) => {
      requests.page
        .filter((request) => !request.seen)
        .forEach((request) => {
          onNewNotification(
            getSendConnectionRequestNotification(request, {
              onClick: () => setConnectionRequestsVisible(true),
            })
          );
        });

      setConnectionRequestsPage(requests);
    });
  }

  function fetchConnections() {
    get<Connection[]>(ApiRoute.CONNECTIONS()).then(setConnections);
  }

  function handleRequestAnswered(
    request: SendConnectionRequest,
    type: ConnectionRequestAnswerType
  ) {
    removeConnectionRequest(request);

    if (type === ConnectionRequestAnswerType.ACCEPTED) {
      addConnection({ username: request.subject });
    }
  }

  function addConnection(connection: Connection) {
    setConnections((connections) => {
      connections?.unshift(connection);
      return connections;
    });
  }

  function addConnectionRequest(request: SendConnectionRequest) {
    setConnectionRequestsPage((requests) => {
      requests?.page.unshift(request);
      return requests;
    });
  }

  function removeConnectionRequest(request: SendConnectionRequest) {
    setConnectionRequestsPage((requests) => {
      if (!requests) {
        return;
      }

      const index = requests.page.findIndex((r) => r.id === request.id);

      if (index < 0) {
        return requests;
      }

      const newPage = requests.page
        .slice(0, index)
        .concat(requests.page.slice(index + 1));

      return {
        ...requests,
        page: newPage,
      };
    });
  }

  function previousConnectionRequestsPage() {
    if (!connectionRequestsPage) {
      return;
    }

    const meta = connectionRequestsPage.meta;
    if (meta.page <= 0) {
      console.warn("no previous page");
      return;
    }

    fetchConnectionRequests(meta.page - 1);
  }

  function nextConnectionRequestsPage() {
    if (!connectionRequestsPage) {
      return;
    }

    const meta = connectionRequestsPage.meta;
    if (meta.page + 1 >= meta.totalPages) {
      console.warn("no next page");
      return;
    }

    fetchConnectionRequests(meta.page + 1);
  }
}
