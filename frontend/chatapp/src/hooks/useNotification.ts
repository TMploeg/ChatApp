import { BsFillPeopleFill } from "react-icons/bs";
import NotificationData from "../models/notification-data";
import ConnectionRequest, {
  AnsweredConnectionRequest,
  SendConnectionRequest,
} from "../models/connection-request";

export default function useNotification() {
  function getSendConnectionRequestNotification(
    request: SendConnectionRequest,
    params?: NotificationParams
  ): NotificationData {
    return {
      ...defaultNotificationData(request, params),
      text: `'${request.subject}' wants to connect with you.`,
    };
  }

  function getAnsweredConnectionRequestNotification(
    request: AnsweredConnectionRequest,
    params?: NotificationParams
  ): NotificationData {
    return {
      ...defaultNotificationData(request, params),
      text: request.accepted
        ? `'${request.subject}' accepted your connection request`
        : `'${request.subject}' rejected your connection request`,
      variant: request.accepted ? "success" : "secondary",
    };
  }

  return {
    getSendConnectionRequestNotification,
    getAnsweredConnectionRequestNotification,
  };
}

interface NotificationParams {
  onClick?: () => void;
}

function defaultNotificationData(
  request: ConnectionRequest,
  params?: NotificationParams
): NotificationData {
  return {
    id: request.id,
    icon: BsFillPeopleFill,
    title: "Connection Request",
    onClick: params?.onClick,
  };
}
