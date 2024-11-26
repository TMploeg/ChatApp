import { BsFillPeopleFill } from "react-icons/bs";
import NotificationData from "../models/notification-data";
import { ConnectionRequest } from "../models/connection-request";
import ConnectionRequestState from "../enums/ConnectionRequestState";

export default function useNotification() {
  function getConnectionRequestNotification(
    request: ConnectionRequest
  ): NotificationData {
    const data: NotificationData = {
      id: request.id,
      icon: BsFillPeopleFill,
      title: "Connection Request",
    };

    switch (request.state.toUpperCase()) {
      case ConnectionRequestState.SEND:
        return {
          ...data,
          text: `'${request.username}' wants to connect with you.`,
          // onClick: () => navigate(AppRoute.CONNECTION_REQUESTS),
        };
      case ConnectionRequestState.ACCEPTED:
        return {
          ...data,
          text: `'${request.username}' accepted your connection request`,
          // onClick: () => navigate(AppRoute.CONNECTIONS),
          variant: "success",
        };
      case ConnectionRequestState.REJECTED:
        return {
          ...data,
          text: `'${request.username}' rejected your connection request`,
          variant: "secondary",
        };
      default:
        throw new Error("invalid state detected (" + request.state + ")");
    }
  }

  return {
    getConnectionRequestNotification,
  };
}
