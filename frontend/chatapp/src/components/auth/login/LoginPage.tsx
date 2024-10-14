import { useState } from "react";
import { Auth } from "../../../models";
import "../Auth.css";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../hooks";

interface Props {
  onLogin?: () => void;
}
export default function LoginPage({ onLogin }: Props) {
  const [loginData, setLoginData] = useState<Auth>({
    username: "",
    password: "",
  });
  const navigate = useNavigate();
  const { login } = useAuth();

  return (
    <div className="auth-page">
      <div>
        <h6>Username</h6>
        <input
          value={loginData.username}
          onChange={(e) =>
            setLoginData((data) => ({ ...data, username: e.target.value }))
          }
        />
      </div>
      <div>
        <h6>Password</h6>
        <input
          value={loginData.password}
          onChange={(e) =>
            setLoginData((data) => ({ ...data, password: e.target.value }))
          }
        />
      </div>
      <button onClick={submit}>Login</button>
    </div>
  );

  function submit(): void {
    login(loginData)
      .then(() => {
        onLogin?.();
        navigate("/");
      })
      .catch(() => alert("login failed"));
  }
}
