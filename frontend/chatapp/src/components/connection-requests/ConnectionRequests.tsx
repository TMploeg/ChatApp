import { BsPersonFill } from "react-icons/bs";
import { ConnectionRequest } from "../../models/connection-requests";
import { Button, Modal } from "react-bootstrap";
import { useAlert, useApi } from "../../hooks";
import ConnectionRequestState from "../../enums/ConnectionRequestState";
import ApiRoute from "../../enums/ApiRoute";
import { useEffect, useState } from "react";
import { ClipLoader } from "react-spinners";
import ConnectionRequestDirection from "../../enums/ConnectionRequestDirection";
import { Variant } from "react-bootstrap/esm/types";
import SeperatedList from "../generic/seperated-list/SeperatedList";
import "./ConnectionRequests.scss";

const VISIBLE_STATES: ConnectionRequestState[] = [
  ConnectionRequestState.SEND,
  ConnectionRequestState.SEEN,
];

interface Props {
  show: boolean;
  onHide: () => void;
}
export default function ConnectionRequests({ show, onHide }: Props) {
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
    <Modal show={show} onHide={onHide} fullscreen>
      <Modal.Header className="connections-backdrop-header" closeButton>
        <h1>Connection Requests</h1>
      </Modal.Header>
      <Modal.Body>
        <div className="connection-requests-container">
          {requests !== undefined ? (
            <SeperatedList
              items={requests}
              ItemRenderElement={({ item: request }) => (
                <RequestView
                  request={request}
                  onRequestInteraction={handleRequestInteraction}
                />
              )}
            />
          ) : (
            <ClipLoader />
          )}
        </div>
      </Modal.Body>
    </Modal>
  );

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
        <h3 className="connection-request-username">{request.username}</h3>
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