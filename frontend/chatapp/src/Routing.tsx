import { Navigate, Route, Routes } from "react-router-dom";
import LoadingPage from "./components/page/LoadingPage";
import ChatPage from "./components/chat/ChatPage";
import AppRoute from "./enums/AppRoute";
import HomePage from "./components/home/HomePage";
import LoginPage from "./components/auth/login/LoginPage";
import RegisterPage from "./components/auth/register/RegisterPage";

interface Props {
  loggedIn: boolean;
  connected: boolean;
  onLogin: () => void;
}
export default function Routing({ loggedIn, connected, onLogin }: Props) {
  if (!loggedIn) {
    return <UnauthenticatedRouting onLogin={onLogin} />;
  }

  return <DefaultAppRouting connected={connected} />;
}

interface DefaultAppRoutingProps {
  connected: boolean;
}
function DefaultAppRouting({ connected }: DefaultAppRoutingProps) {
  return (
    <LoadingPage loaded={connected}>
      <Routes>
        <Route path={AppRoute.HOME.value} element={<HomePage />} />
        <Route path={AppRoute.CHAT(":id").value} element={<ChatPage />} />
        <Route path={AppRoute.ANY.value} element={<Navigate to="" />} />
      </Routes>
    </LoadingPage>
  );
}

interface UnauthenticatedRoutingProps {
  onLogin: () => void;
}
function UnauthenticatedRouting({ onLogin }: UnauthenticatedRoutingProps) {
  return (
    <Routes>
      <Route
        path={AppRoute.HOME.value}
        element={<Navigate to={AppRoute.LOGIN.value} />}
      />
      <Route
        path={AppRoute.LOGIN.value}
        element={<LoginPage onLogin={onLogin} />}
      />
      <Route
        path={AppRoute.REGISTER.value}
        element={<RegisterPage onRegister={onLogin} />}
      />
      <Route path={AppRoute.ANY.value} element={<Navigate to="" />} />
    </Routes>
  );
}
