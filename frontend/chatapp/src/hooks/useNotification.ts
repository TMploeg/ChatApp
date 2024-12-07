import { BsFillPeopleFill } from "react-icons/bs";
import NotificationData from "../models/notification-data";
import ConnectionRequest, {
  AnsweredConnectionRequest,
} from "../models/connection-request";

export default function useNotification() {
  function getSendConnectionRequestNotification(
    requests: ConnectionRequest[],
    params?: NotificationParams
  ): NotificationData {
    if (requests.length === 0) {
      throw new Error("requests should have at least one element");
    }

    return {
      ...defaultNotificationData(requests, params),
      text:
        requests.length > 1
          ? "one or more users want to connect with you."
          : `'${requests[0].subject}' wants to connect with you`,
    };
  }

  function getAnsweredConnectionRequestNotification(
    request: AnsweredConnectionRequest,
    params?: NotificationParams
  ): NotificationData {
    return {
      ...defaultNotificationData([request], params),
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
  requests: ConnectionRequest[],
  params?: NotificationParams
): NotificationData {
  return {
    id: requests.map((r) => r.id).join("-"),
    icon: BsFillPeopleFill,
    title: "Connection Request",
    onClick: params?.onClick,
  };
}
