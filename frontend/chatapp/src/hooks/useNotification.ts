import { BsFillPeopleFill } from "react-icons/bs";
import NotificationData from "../models/notification-data";
import { ConnectionRequest } from "../models/connection-request";
import ConnectionRequestState from "../enums/ConnectionRequestState";

export default function useNotification() {
  function getConnectionRequestNotification(
    request: ConnectionRequest,
    params?: NotificationParams
  ): NotificationData {
    const data: NotificationData = {
      id: request.id,
      icon: BsFillPeopleFill,
      title: "Connection Request",
      onClick: params?.onClick,
    };

    switch (request.state.toUpperCase()) {
      case ConnectionRequestState.SEND:
        data.text = `'${request.subject}' wants to connect with you.`;
        break;
      case ConnectionRequestState.ACCEPTED:
        data.text = `'${request.subject}' accepted your connection request`;
        data.variant = "success";
        break;
      case ConnectionRequestState.REJECTED:
        data.text = `'${request.subject}' rejected your connection request`;
        data.variant = "secondary";
        break;
      default:
        throw new Error("invalid state detected (" + request.state + ")");
    }

    return data;
  }

  return {
    getConnectionRequestNotification,
  };
}

interface NotificationParams {
  onClick?: () => void;
}
