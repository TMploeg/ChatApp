import { useContext } from "react";
import { Socket } from "./useWebSocket";
import StompBroker from "../enums/StompBroker";
import useNotification from "./useNotification";
import AppContext, { AppContextData } from "../AppContext";
import { ConnectionRequest } from "../models/connection-requests";

export default function useConnectionRequests(socket: Socket) {
  const { notifications } = useContext<AppContextData>(AppContext);
  const { getConnectionRequestNotification } = useNotification();

  function enableConnectionRequestListener(onNewRequest?: () => void) {
    socket.subscribe<ConnectionRequest>(
      StompBroker.CONNECTION_REQUESTS,
      (request) => {
        notifications.add(getConnectionRequestNotification(request));
        onNewRequest?.();
      }
    );
  }

  return { enableConnectionRequestListener };
}
