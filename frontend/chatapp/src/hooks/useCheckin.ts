import { useContext } from "react";
import ApiRoute from "../enums/ApiRoute";
import { ConnectionRequest } from "../models/connection-requests";
import useApi from "./useApi";
import AppContext from "../AppContext";
import useNotification from "./useNotification";

export default function useCheckin() {
  const { get } = useApi();
  const { notifications } = useContext(AppContext);
  const { getConnectionRequestNotification } = useNotification();

  return function checkin() {
    get<CheckinData>(ApiRoute.CHECKIN()).then((checkinData) => {
      for (let request of checkinData.newConnectionRequests) {
        notifications.add(getConnectionRequestNotification(request));
      }
    });
  };
}

export interface CheckinData {
  newConnectionRequests: ConnectionRequest[];
}
