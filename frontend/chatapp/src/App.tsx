import { useEffect, useState } from "react";
import { useStorage, useWebSocket } from "./hooks";
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
import ChatHistoryType from "./enums/ChatHistoryType";

const CHAT_HISTORY_ROUTE = "/user/queue/history";
const DEBUG_ENABLED: boolean = false;

interface HistoryMessage {
  type: string;
  data: Message[];
}

function App() {
  const { get: getToken, set: setToken } = useStorage<JWT>(StorageLocation.JWT);

  const [connected, setConnected] = useState<boolean>(false);
  const [loggedIn, setLoggedIn] = useState<boolean>(!!getToken());
  const [history, setHistory] = useState<{
    [key in ChatHistoryType]?: Message[];
  }>({});
  const [historyUnsubscribeHandler, setHistoryUnsubscribeHandler] =
    useState<() => void>();

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
      onConnect: handleConnect,
      onDisconnect: handleDisconnect,
    });

    return () => socket.disconnect();
  }, [loggedIn]);

  return (
    <div className="app-container">
      <Toolbar
        title="ChatApp"
        onLogout={() => {
          setToken(null);
          setLoggedIn(false);
        }}
      />
      <div className="app">
        {loggedIn && connected && (
          <div className="app-menu">
            <NavMenu />
          </div>
        )}
        <div className="app-content">{getRoutes()}</div>
      </div>
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
                    send={(destination, message) =>
                      socket.send(destination, message)
                    }
                    history={history.GLOBAL}
                    clearHistory={() => clearHistory(ChatHistoryType.GLOBAL)}
                  />
                </LoadingPage>
              }
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

  function handleConnect() {
    const historySubscription = socket.subscribe<HistoryMessage>(
      CHAT_HISTORY_ROUTE,
      (response) => {
        if (!(response.type in ChatHistoryType)) {
          console.error("invalid type detected");
          return;
        }

        const type: ChatHistoryType = response.type as ChatHistoryType;
        if (type === ChatHistoryType.CONFIRMATION) {
          setConnected(true);
          return;
        }

        setHistory((history) => {
          const newHistory = { ...history };
          newHistory[type] = response.data;

          return newHistory;
        });
      }
    );

    setHistoryUnsubscribeHandler((handler) => historySubscription.unsubscribe);
  }

  function handleDisconnect() {
    if (historyUnsubscribeHandler) {
      historyUnsubscribeHandler();
      setHistoryUnsubscribeHandler(undefined);
    }

    setConnected(false);
  }

  function clearHistory(type: ChatHistoryType) {
    setHistory((history) => {
      const newHistory = { ...history };
      delete newHistory[type];

      return newHistory;
    });
  }
}

export default App;
