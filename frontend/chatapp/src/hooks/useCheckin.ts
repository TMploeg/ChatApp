import { useContext } from "react";
import ApiRoute from "../enums/ApiRoute";
import { ReceivedConnectionRequest } from "../models/connection-requests";
import useApi from "./useApi";
import AppContext, { AppContextData } from "../AppContext";
import useNotification from "./useNotification";

export default function useCheckin() {
  const { get } = useApi();
  const { notifications } = useContext<AppContextData>(AppContext);
  const { getConnectionRequestNotification } = useNotification();

  return function checkin() {
    get<CheckinData>(ApiRoute.CHECKIN).then((checkinData) => {
      notifications.init();

      for (let request of checkinData.newConnectionRequests) {
        notifications.add(getConnectionRequestNotification(request));
      }
    });
  };
}

export interface CheckinData {
  newConnectionRequests: ReceivedConnectionRequest[];
}
