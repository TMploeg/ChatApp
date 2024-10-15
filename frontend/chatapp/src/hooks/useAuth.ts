import axios from "axios";
import { Auth } from "../models";
import useStorage from "./useStorage";
import { StorageLocation } from "../enums/StorageLocation";
import { JWT } from "../models/auth";

export default function useAuth() {
  const { set: setJWT } = useStorage<JWT>(StorageLocation.JWT);

  function login(loginData: Auth) {
    return axios
      .post<JWT>(import.meta.env.VITE_API_URL + "auth/login", loginData)
      .then((response) => {
        if (response.status.toString().charAt(0) !== "2") {
          console.error("auth request failed");
          return;
        }

        setJWT(response.data);
      });
  }

  function register(registerData: Auth) {
    return axios
      .post<JWT>(import.meta.env.VITE_API_URL + "auth/register", registerData)
      .then((response) => {
        if (response.status.toString().charAt(0) !== "2") {
          console.error("auth request failed");
          return;
        }

        setJWT(response.data);
      });
  }

  return { login, register };
}
