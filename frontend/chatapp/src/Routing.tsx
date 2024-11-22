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
  return (
    <Routes>
      {loggedIn ? (
        <>
          <Route path={AppRoute.HOME.value} element={<HomePage />} />
          <Route
            path={AppRoute.CHAT(":id").value}
            element={
              <LoadingPage loaded={connected}>
                <ChatPage />
              </LoadingPage>
            }
          />
        </>
      ) : (
        <>
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
        </>
      )}
      <Route
        path={AppRoute.ANY.value}
        element={<Navigate to={AppRoute.HOME.value} />}
      />
    </Routes>
  );
}
