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
import SendConnectionRequestModal from "./send-connection-request-modal/SendConnectionRequestModal";

export default function ConnectionsPage() {
  const [connections, setConnections] = useState<Connection[]>();
  const [modalVisible, setModalVisible] = useState<boolean>(false);

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
            onClick={() => navigate(AppRoute.CONNECTION_REQUESTS)}
          >
            Connection Requests
          </Button>
        </div>
        <Button variant="primary" onClick={() => setModalVisible(true)}>
          Add User
        </Button>
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
      <SendConnectionRequestModal
        show={modalVisible}
        onHide={() => setModalVisible(false)}
      />
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
