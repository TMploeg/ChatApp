import ApiRoute from "../enums/ApiRoute";
import ConnectionRequestState from "../enums/ConnectionRequestState";
import { ConnectionRequest } from "../models/connection-request";
import useApi from "./useApi";
import useConnectionRequests from "./useConnectionRequests";

export default function useCheckin() {
  const { get } = useApi();
  const { updateState } = useConnectionRequests();

  return function getCheckinData(): Promise<CheckinData> {
    return get<CheckinData>(ApiRoute.CHECKIN()).then((data) => {
      data.newConnectionRequests
        .filter(
          (request) =>
            request.state.toUpperCase() ===
            ConnectionRequestState.SEND.toUpperCase()
        )
        .forEach((request) =>
          updateState(request, ConnectionRequestState.SEEN)
        );

      return data;
    });
  };
}

export interface CheckinData {
  newConnectionRequests: ConnectionRequest[];
}
