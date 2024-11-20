import { BsPersonFill } from "react-icons/bs";
import { ConnectionRequest } from "../../models/connection-requests";
import PageTitle from "../page/title/PageTitle";
import "./ConnectionRequestsPage.scss";
import { Button } from "react-bootstrap";
import { useApi } from "../../hooks";
import ConnectionRequestState from "../../enums/ConnectionRequestState";
import ApiRoute from "../../enums/ApiRoute";
import { useEffect, useState } from "react";
import { ClipLoader } from "react-spinners";
import ConnectionRequestDirection from "../../enums/ConnectionRequestDirection";

const VISIBLE_STATES: ConnectionRequestState[] = [
  ConnectionRequestState.SEND,
  ConnectionRequestState.SEEN,
];

export default function ConnectionRequestsPage() {
  const { get, patch } = useApi();
  const [requests, setRequests] = useState<ConnectionRequest[]>();

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
          onRequestInteraction={handleRequestInteracted}
        />,
      ];

      if (index > 0) {
        newElements.unshift(<hr key={"hr_" + index} />);
      }

      return newElements;
    });
  }

  function handleRequestInteracted(
    request: ConnectionRequest,
    state: ConnectionRequestState
  ) {
    patch<void>(ApiRoute.SINGLE_CONNECTION_REQUEST(request.id), {
      state,
    })
      .then(() => removeRequest(request))
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
