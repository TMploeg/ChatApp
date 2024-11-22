import { useContext } from "react";
import Toolbar from "./components/toolbar/Toolbar";
import "./App.scss";
import Notification from "./components/notifications/Notification";
import { ToastContainer } from "react-bootstrap";
import AppContext from "./AppContext";
import ChatMenu from "./components/chat-menu/ChatMenu";
import Routing from "./Routing";

interface AppProps {
  loggedIn: boolean;
  connected: boolean;
  onLogin: () => void;
  onLogout: () => void;
}
export default function App({
  loggedIn,
  connected,
  onLogin,
  onLogout,
}: AppProps) {
  const { notifications: notificationContext } = useContext(AppContext);

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
        {notificationContext.data.map((notification) => (
          <Notification
            key={notification.id}
            notification={notification}
            onClick={notification.onClick}
          />
        ))}
      </ToastContainer>
    </div>
  );
}
