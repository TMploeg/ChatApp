import { StorageLocation } from "../enums/StorageLocation";
import { JWT } from "../models";
import useStorage from "./useStorage";

export default function useToken() {
  const { get: getJWT } = useStorage<JWT>(StorageLocation.JWT);

  return function getToken(): string | undefined {
    const jwt = getJWT();

    if (jwt) {
      return "Bearer " + jwt.token;
    }

    return undefined;
  };
}
