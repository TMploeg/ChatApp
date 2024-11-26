import ApiRoute from "../enums/ApiRoute";
import ConnectionRequestState from "../enums/ConnectionRequestState";
import { ConnectionRequest } from "../models/connection-request";
import useApi from "./useApi";

export default function useConnectionRequests() {
  const { patch } = useApi();

  function updateState(
    request: ConnectionRequest,
    newState: ConnectionRequestState
  ): Promise<void> {
    return patch<void>(ApiRoute.SINGLE_CONNECTION_REQUEST(request.id), {
      state: newState,
    });
  }

  return {
    updateState,
  };
}
