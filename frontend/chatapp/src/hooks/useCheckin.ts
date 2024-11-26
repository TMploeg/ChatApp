import ApiRoute from "../enums/ApiRoute";
import { ConnectionRequest } from "../models/connection-request";
import useApi from "./useApi";

export default function useCheckin() {
  const { get } = useApi();

  return function getCheckinData(): Promise<CheckinData> {
    return get<CheckinData>(ApiRoute.CHECKIN());
  };
}

export interface CheckinData {
  newConnectionRequests: ConnectionRequest[];
}
