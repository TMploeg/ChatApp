import { useEffect, useState } from "react";
import { useStorage, useWebSocket } from "./hooks";
import { ClipLoader } from "react-spinners";
import { Navigate, Route, Routes } from "react-router-dom";
import { StorageLocation } from "./enums/StorageLocation";
import LoginPage from "./components/auth/login/LoginPage";
import GlobalChatPage from "./components/chat/global/GlobalChatPage";
import { JWT } from "./models/auth";

function App() {
  const socket = useWebSocket();
  const [connected, setConnected] = useState<boolean>(false);
  const { get: getToken } = useStorage<JWT>(StorageLocation.JWT);
  const [loggedIn, setLoggedIn] = useState<boolean>(!!getToken());

  useEffect(() => {
    socket.onConnect(() => setConnected(true));
    socket.onDisconnect(() => setConnected(false));
  }, []);

  useEffect(() => {
    if (loggedIn === connected) {
      return;
    }

    if (loggedIn) {
      console.log(getToken());
      socket.connect();
    } else {
      socket.disconnect();
    }
  }, [loggedIn]);

  return <div className="app">{getRoutes()}</div>;

  function getRoutes() {
    return (
      <Routes>
        {loggedIn ? (
          <>
            <Route
              path="/"
              element={<GlobalChatPage socket={socket} connected={connected} />}
            />
          </>
        ) : (
          <>
            <Route path="/" element={<Navigate to="/login" />} />
            <Route
              path="/login"
              element={<LoginPage onLogin={() => setLoggedIn(true)} />}
            />
          </>
        )}
        <Route path="/*" element={<Navigate to="/" />} />
      </Routes>
    );
  }
}

export default App;
