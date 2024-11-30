import { BsPersonFill } from "react-icons/bs";
import { ConnectionRequest } from "../../models/connection-request";
import { Button, Modal } from "react-bootstrap";
import { useAlert, useConnectionRequests } from "../../hooks";
import ConnectionRequestState from "../../enums/ConnectionRequestState";
import { useEffect } from "react";
import { ClipLoader } from "react-spinners";
import { Variant } from "react-bootstrap/esm/types";
import SeperatedList from "../generic/seperated-list/SeperatedList";
import "./ConnectionRequests.scss";

interface Props {
  show: boolean;
  onHide: () => void;
  connectionRequests: ConnectionRequest[];
  onRequestRemoved: (request: ConnectionRequest) => void;
}
//TODO implement pagination
export default function ConnectionRequestsOverlay({
  show,
  onHide,
  connectionRequests,
  onRequestRemoved,
}: Props) {
  const { updateState } = useConnectionRequests();

  const alert = useAlert();

  useEffect(() => {
    if (connectionRequests) {
      connectionRequests
        .filter((request) => request.state === ConnectionRequestState.SEND)
        .forEach((request) =>
          updateState(request, ConnectionRequestState.SEEN)
        );
    }
  }, [show]);

  return (
    <Modal show={show} onHide={onHide} fullscreen>
      <Modal.Header className="connections-backdrop-header" closeButton>
        <h1>Connection Requests</h1>
      </Modal.Header>
      <Modal.Body>
        <div className="connection-requests-container">
          {connectionRequests !== undefined ? (
            <SeperatedList
              items={connectionRequests}
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
    updateState(request, state)
      .then(() => {
        onRequestRemoved(request);
        sendRequestInteractionSuccesAlert(state);
      })
      .catch((error) => console.error(error));
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
        <h3 className="connection-request-username">{request.subject}</h3>
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
