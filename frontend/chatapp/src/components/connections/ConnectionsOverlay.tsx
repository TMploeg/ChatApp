import { Button, Modal } from "react-bootstrap";
import { useAppNavigate, useChatGroups } from "../../hooks";
import SeperatedList from "../generic/seperated-list/SeperatedList";
import { useState } from "react";
import Connection from "../../models/connection";
import { ClipLoader } from "react-spinners";
import SendConnectionRequestModal from "./send-connection-request-modal/SendConnectionRequestModal";
import "./Connections.scss";
import ConnectionView from "./ConnectionView";
import { BsPersonPlusFill } from "react-icons/bs";
import AppRoute from "../../enums/AppRoute";

interface Props {
  show: boolean;
  onHide: () => void;
  connections: Connection[];
}
export default function ConnectionsOverlay({
  show,
  onHide,
  connections,
}: Props) {
  const [addUserModalVisible, setAddUserModalVisible] =
    useState<boolean>(false);

  const { findClosedGroupForConnection, createClosedGroup } = useChatGroups();

  const navigate = useAppNavigate();

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

  async function handleConnectionClicked(connection: Connection) {
    const connectionGroup =
      (await findClosedGroupForConnection(connection)) ??
      (await createClosedGroup(connection.username));

    navigate(AppRoute.CHAT(connectionGroup.getId()));

    onHide();
  }
}
