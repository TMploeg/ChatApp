import { BsPersonFill } from "react-icons/bs";
import { ConnectionRequest } from "../../models/connection-requests";
import PageTitle from "../page/title/PageTitle";
import "./ConnectionRequestsPage.scss";
import { Button } from "react-bootstrap";
import { useAlert, useApi } from "../../hooks";
import ConnectionRequestState from "../../enums/ConnectionRequestState";
import ApiRoute from "../../enums/ApiRoute";
import { useEffect, useState } from "react";
import { ClipLoader } from "react-spinners";
import ConnectionRequestDirection from "../../enums/ConnectionRequestDirection";
import { Variant } from "react-bootstrap/esm/types";

const VISIBLE_STATES: ConnectionRequestState[] = [
  ConnectionRequestState.SEND,
  ConnectionRequestState.SEEN,
];

export default function ConnectionRequestsPage() {
  const { get, patch } = useApi();

  const [requests, setRequests] = useState<ConnectionRequest[]>();

  const alert = useAlert();

  useEffect(() => {
    get<ConnectionRequest[]>(ApiRoute.CONNECTION_REQUESTS(), {
      state: VISIBLE_STATES.join(","),
      direction: ConnectionRequestDirection.RECEIVED,
    }).then(setRequests);
  }, []);

  return (
    <div className="connection-requests-page">
      <PageTitle text="Connection Requests" />
      <div className="connection-requests-container">
        {requests !== undefined ? getNewRequestViews(requests) : <ClipLoader />}
      </div>
    </div>
  );

  function getNewRequestViews(requests: ConnectionRequest[]) {
    return requests.flatMap((request, index) => {
      const newElements = [
        <RequestView
          key={"req_" + request.id}
          request={request}
          onRequestInteraction={handleRequestInteraction}
        />,
      ];

      if (index > 0) {
        newElements.unshift(<hr key={"hr_" + index} />);
      }

      return newElements;
    });
  }

  function handleRequestInteraction(
    request: ConnectionRequest,
    state: ConnectionRequestState
  ) {
    patch<void>(ApiRoute.SINGLE_CONNECTION_REQUEST(request.id), {
      state,
    })
      .then(() => {
        removeRequest(request);
        sendRequestInteractionSuccesAlert(state);
      })
      .catch((error) => console.error(error));
  }

  function removeRequest(request: ConnectionRequest) {
    setRequests((requests) => {
      if (!requests) {
        return undefined;
      }

      return requests.filter((r) => r.id !== request.id);
    });
  }

  function sendRequestInteractionSuccesAlert(
    requestState: ConnectionRequestState
  ) {
    type AlertData = { message: string; variant: Variant };
    const data: AlertData | null =
      requestState === ConnectionRequestState.ACCEPTED
        ? { message: "Request accepted!", variant: "success" }
        : requestState === ConnectionRequestState.REJECTED
        ? { message: "Request rejected.", variant: "info" }
        : requestState === ConnectionRequestState.IGNORED
        ? { message: "Request ignored.", variant: "info" }
        : null;

    if (data === null) {
      console.error("invalid state detected at interaction alert");
      return;
    }

    alert(data.message, data.variant);
  }
}

interface RequestViewProps {
  request: ConnectionRequest;
  onRequestInteraction: (
    request: ConnectionRequest,
    state: ConnectionRequestState
  ) => void;
}
function RequestView({ request, onRequestInteraction }: RequestViewProps) {
  return (
    <div className="connection-request">
      <div className="connection-request-image">
        <BsPersonFill size={50} />
      </div>
      <div>
        <h3 className="connection-request-username">
          {request.senderUsername}
        </h3>
        <div className="connection-request-buttons">
          <Button
            variant="outline-success"
            onClick={() =>
              onRequestInteraction(request, ConnectionRequestState.ACCEPTED)
            }
          >
            ACCEPT
          </Button>
          <Button
            variant="outline-danger"
            onClick={() =>
              onRequestInteraction(request, ConnectionRequestState.REJECTED)
            }
          >
            REJECT
          </Button>
          <Button
            variant="outline-secondary"
            onClick={() =>
              onRequestInteraction(request, ConnectionRequestState.IGNORED)
            }
          >
            IGNORE
          </Button>
        </div>
      </div>
    </div>
  );
}
