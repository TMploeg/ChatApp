import { Button, Modal } from "react-bootstrap";
import { useApi, useAppNavigate, useChatGroups } from "../../hooks";
import SeperatedList from "../generic/seperated-list/SeperatedList";
import { useContext, useEffect, useState } from "react";
import Connection from "../../models/connection";
import { ClipLoader } from "react-spinners";
import ApiRoute from "../../enums/ApiRoute";
import SendConnectionRequestModal from "./send-connection-request-modal/SendConnectionRequestModal";
import "./Connections.scss";
import ConnectionView from "./ConnectionView";
import { BsPersonPlusFill } from "react-icons/bs";
import AppContext from "../../AppContext";
import ConnectionRequestState from "../../enums/ConnectionRequestState";
import AppRoute from "../../enums/AppRoute";

interface Props {
  show: boolean;
  onHide: () => void;
  newConnectionStream?: NewConnectionStream;
}
export default function Connections({
  show,
  onHide,
  newConnectionStream,
}: Props) {
  const [connections, setConnections] = useState<Connection[]>();
  const [addUserModalVisible, setAddUserModalVisible] =
    useState<boolean>(false);

  const { get } = useApi();
  const { createPrivateGroup } = useChatGroups();

  const { subscriptions } = useContext(AppContext);

  const navigate = useAppNavigate();

  useEffect(() => {
    get<Connection[]>(ApiRoute.CONNECTIONS()).then(setConnections);

    const subscription = subscriptions.connectionRequests.subscribe(
      "Connections",
      (request) => {
        if (
          request.state.toUpperCase() ===
          ConnectionRequestState.ACCEPTED.toUpperCase()
        ) {
          handleNewConnection({
            username: request.subject,
          });
        }
      }
    );

    newConnectionStream?.subscribe(handleNewConnection);

    return () => subscription.unsubscribe();
  }, []);

  return (
    <Modal show={show} onHide={onHide} fullscreen>
      <Modal.Header className="connections-backdrop-header" closeButton>
        <h1>Connections</h1>
        <Button
          variant="outline-primary"
          onClick={() => setAddUserModalVisible(true)}
          size="lg"
        >
          <BsPersonPlusFill size={30} />
        </Button>
      </Modal.Header>
      <Modal.Body>
        {connections !== undefined ? (
          <div className="connections-container">
            <SeperatedList
              items={connections.map((conn) => ({
                ...conn,
                id: conn.username,
              }))}
              ItemRenderElement={({ item: connection }) => (
                <ConnectionView
                  connection={connection}
                  onClick={() => handleConnectionClicked(connection)}
                />
              )}
            />
          </div>
        ) : (
          <ClipLoader />
        )}
        <SendConnectionRequestModal
          show={addUserModalVisible}
          onHide={() => setAddUserModalVisible(false)}
        />
      </Modal.Body>
    </Modal>
  );

  function handleNewConnection(connection: Connection) {
    setConnections((connections) => {
      connections?.unshift(connection);
      return connections;
    });
  }

  function handleConnectionClicked(connection: Connection) {
    onHide();
    createPrivateGroup(connection.username).then((createdGroup) =>
      navigate(AppRoute.CHAT(createdGroup.getId()))
    );
  }
}

export interface NewConnectionStream {
  subscribe(callback: (connection: Connection) => void): void;
}
