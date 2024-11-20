import { Button } from "react-bootstrap";
import PageTitle from "../page/title/PageTitle";
import BadgeNotification from "../generic/badge-notification/BadgeNotification";
import "./ConnectionsPage.scss";
import { useApi, useAppNavigate } from "../../hooks";
import AppRoute from "../../enums/AppRoute";
import SeperatedList from "../generic/seperated-list/SeperatedList";
import { useEffect, useState } from "react";
import Connection from "../../models/connection";
import { ClipLoader } from "react-spinners";
import { BsPersonFill } from "react-icons/bs";
import ApiRoute from "../../enums/ApiRoute";

interface Props {
  hasNewRequests?: boolean;
  onNewRequestsChecked?: () => void;
}
export default function ConnectionsPage({
  hasNewRequests,
  onNewRequestsChecked,
}: Props) {
  const [connections, setConnections] = useState<Connection[]>();

  const navigate = useAppNavigate();

  const { get } = useApi();

  useEffect(() => {
    get<Connection[]>(ApiRoute.CONNECTIONS()).then(setConnections);
  }, []);

  return (
    <div className="connections-page">
      <PageTitle text="Connections">
        <div className="connection-requests-button-container">
          <Button
            variant="outline-primary"
            onClick={() => {
              onNewRequestsChecked?.();
              navigate(AppRoute.CONNECTION_REQUESTS);
            }}
          >
            Connection Requests
          </Button>
          {hasNewRequests && <BadgeNotification />}
        </div>
      </PageTitle>
      {connections !== undefined ? (
        <div className="connections-container">
          <SeperatedList
            items={connections.map((conn) => ({ ...conn, id: conn.username }))}
            ItemRenderElement={({ item: connection }) => (
              <ConnectionView connection={connection} />
            )}
          />
        </div>
      ) : (
        <ClipLoader />
      )}
    </div>
  );
}

interface ConnectionViewProps {
  connection: Connection;
}
function ConnectionView({ connection }: ConnectionViewProps) {
  return (
    <div className="connection">
      <div className="connection-image">
        <BsPersonFill size={50} />
      </div>
      <div>
        <h2 className="connection-username">{connection.username}</h2>
      </div>
    </div>
  );
}

/*
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

*/
