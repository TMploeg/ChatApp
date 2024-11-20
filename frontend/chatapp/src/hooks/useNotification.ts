import { BsFillPeopleFill } from "react-icons/bs";
import NotificationData from "../models/notification-data";
import { ConnectionRequest } from "../models/connection-requests";

export default function useNotification() {
  function getConnectionRequestNotification(
    request: ConnectionRequest
  ): NotificationData {
    return {
      id: request.id,
      icon: BsFillPeopleFill,
      title: "Connection Request",
      text: `'${request.senderUsername}' wants to connect with you.`,
    };
  }

  return {
    getConnectionRequestNotification,
  };
}
