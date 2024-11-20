import { Auth } from "../models";
import useStorage from "./useStorage";
import { StorageLocation } from "../enums/StorageLocation";
import { JWT } from "../models/auth";
import useApi from "./useApi";
import ApiRoute from "../enums/ApiRoute";

export default function useAuth() {
  const { set: setJWT } = useStorage<JWT>(StorageLocation.JWT);
  const { post } = useApi();

  function login(loginData: Auth) {
    return post<JWT>(ApiRoute.LOGIN(), loginData)
      .then(setJWT)
      .catch(() => alert("login failed"));
  }

  function register(registerData: Auth) {
    return post<JWT>(ApiRoute.REGISTER(), registerData)
      .then(setJWT)
      .catch(() => alert("registration failed"));
  }

  return { login, register };
}
