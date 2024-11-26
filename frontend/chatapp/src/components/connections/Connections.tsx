import { Button, Modal } from "react-bootstrap";
import { useApi } from "../../hooks";
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

interface Props {
  show: boolean;
  onHide: () => void;
}
export default function Connections({ show, onHide }: Props) {
  const [connections, setConnections] = useState<Connection[]>();
  const [addUserModalVisible, setAddUserModalVisible] =
    useState<boolean>(false);

  const { get } = useApi();

  const { subscriptions } = useContext(AppContext);

  useEffect(() => {
    get<Connection[]>(ApiRoute.CONNECTIONS()).then(setConnections);

    const subscription = subscriptions.connectionRequests.subscribe(
      "Connections",
      (request) => {
        console.log("NEW REQUEST", request);
        if (request.state === ConnectionRequestState.ACCEPTED) {
          handleNewConnection({
            username: request.username,
          });
        }
      }
    );

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
                <ConnectionView connection={connection} />
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
}
