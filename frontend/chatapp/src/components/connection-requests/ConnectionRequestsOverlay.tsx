import { BsPersonFill } from "react-icons/bs";
import { Button, Modal } from "react-bootstrap";
import { useAlert, useConnectionRequests } from "../../hooks";
import { useEffect } from "react";
import { ClipLoader } from "react-spinners";
import { Variant } from "react-bootstrap/esm/types";
import SeperatedList from "../generic/seperated-list/SeperatedList";
import "./ConnectionRequests.scss";
import { SendConnectionRequest } from "../../models/connection-request";
import ConnectionRequestAnswerType from "../../enums/ConnectionRequestAnswerType";

interface Props {
  show: boolean;
  onHide: () => void;
  connectionRequests: SendConnectionRequest[];
  onRequestAnswered: (
    request: SendConnectionRequest,
    type: ConnectionRequestAnswerType
  ) => void;
}
export default function ConnectionRequestsOverlay({
  show,
  onHide,
  connectionRequests,
  onRequestAnswered,
}: Props) {
  const { markRequestSeen, answerRequest } = useConnectionRequests();

  const alert = useAlert();

  useEffect(() => {
    if (connectionRequests) {
      connectionRequests
        .filter((request) => !request.seen)
        .forEach((request) => markRequestSeen(request));
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
                  onRequestAnswered={handleRequestAnswered}
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

  function handleRequestAnswered(
    request: SendConnectionRequest,
    type: ConnectionRequestAnswerType
  ) {
    answerRequest(request, type)
      .then(() => {
        const data: AlertData = getAlertDataForAnswerType(type);

        alert(data.message, data.variant);

        onRequestAnswered(request, type);
      })
      .catch((error) => console.error(error));
  }

  function getAlertDataForAnswerType(type: ConnectionRequestAnswerType) {
    switch (type) {
      case ConnectionRequestAnswerType.ACCEPTED:
        return { message: "Request accepted!", variant: "success" };
      case ConnectionRequestAnswerType.REJECTED:
        return { message: "Request rejected.", variant: "info" };
      case ConnectionRequestAnswerType.IGNORED:
        return { message: "Request ignored.", variant: "info" };
    }
  }
}

interface RequestViewProps {
  request: SendConnectionRequest;
  onRequestAnswered: (
    request: SendConnectionRequest,
    type: ConnectionRequestAnswerType
  ) => void;
}
function RequestView({ request, onRequestAnswered }: RequestViewProps) {
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
              onRequestAnswered(request, ConnectionRequestAnswerType.ACCEPTED)
            }
          >
            ACCEPT
          </Button>
          <Button
            variant="outline-danger"
            onClick={() =>
              onRequestAnswered(request, ConnectionRequestAnswerType.REJECTED)
            }
          >
            REJECT
          </Button>
          <Button
            variant="outline-secondary"
            onClick={() =>
              onRequestAnswered(request, ConnectionRequestAnswerType.IGNORED)
            }
          >
            IGNORE
          </Button>
        </div>
      </div>
    </div>
  );
}

type AlertData = { message: string; variant: Variant };
