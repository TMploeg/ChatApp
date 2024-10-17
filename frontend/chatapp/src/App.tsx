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

const CHAT_HISTORY_ROUTE = "/user/queue/history";
const DEBUG_ENABLED: boolean = false;

interface HistoryMessage {
  data?: Message[];
}

function App() {
  const { get: getToken } = useStorage<JWT>(StorageLocation.JWT);

  const [connected, setConnected] = useState<boolean>(false);
  const [loggedIn, setLoggedIn] = useState<boolean>(!!getToken());
  const [history, setHistory] = useState<Message[]>();

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
  }, [loggedIn]);

  return (
    <div className="app-container">
      <Toolbar title="ChatApp" />
      <div className="app">
        {loggedIn && (
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
                <GlobalChatPage
                  socket={socket}
                  connected={connected}
                  history={history}
                  clearHistory={() => setHistory(undefined)}
                />
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
    socket.subscribe<HistoryMessage>(CHAT_HISTORY_ROUTE, (response) => {
      // when subscribing to history, server will send an empty message to signal successful subscription
      if (!response.data) {
        setConnected(true);
        return;
      }

      setHistory(response.data);
    });
  }

  function handleDisconnect() {
    setConnected(false);
  }
}

export default App;
