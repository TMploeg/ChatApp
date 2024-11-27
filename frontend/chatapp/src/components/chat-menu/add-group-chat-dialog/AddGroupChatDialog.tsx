import { useEffect, useState } from "react";
import { Button, Form, FormGroup, Modal } from "react-bootstrap";
import Connection from "../../../models/connection";
import { useApi, useChatGroups } from "../../../hooks";
import ApiRoute from "../../../enums/ApiRoute";
import { ClipLoader } from "react-spinners";
import SeperatedList from "../../generic/seperated-list/SeperatedList";
import "./AddGroupChatDialog.scss";
import ChatGroup from "../../../models/chat-group";

interface Props {
  show: boolean;
  onHide: () => void;
  onCreated?: (group: ChatGroup) => void;
}
export default function AddGroupChatDialog({ show, onHide, onCreated }: Props) {
  const [groupName, setGroupName] = useState<string | undefined>(undefined);
  const [selectedUsernames, setSelectedUsernames] = useState<string[]>([]);
  const [connections, setConnections] = useState<Connection[]>();

  const { get } = useApi();
  const { createMultiGroup } = useChatGroups();

  useEffect(() => {
    if (show) {
      get<Connection[]>(ApiRoute.CONNECTIONS()).then(setConnections);
    } else {
      setGroupName(undefined);
      setSelectedUsernames([]);
    }
  }, [show]);
  return (
    <Modal show={show} onHide={onHide} className="add-group-chat-dialog">
      <Modal.Header closeButton>Test Header!</Modal.Header>
      <Modal.Body>
        <FormGroup>
          <Form.Label>Group Name</Form.Label>
          <Form.Control
            value={groupName ?? ""}
            onChange={(e) =>
              setGroupName(
                e.target.value.length > 0 ? e.target.value : undefined
              )
            }
          />
        </FormGroup>
        {connections ? (
          <FormGroup>
            <Form.Label>Username</Form.Label>
            <Form.Select
              onChange={(e) =>
                setSelectedUsernames((users) => [e.target.value, ...users])
              }
              defaultValue=""
            >
              <option disabled value="">
                --- click here to select a user ---
              </option>
              {connections.map((connection) => (
                <option key={connection.username} value={connection.username}>
                  {connection.username}
                </option>
              ))}
            </Form.Select>
          </FormGroup>
        ) : (
          <ClipLoader color="white" />
        )}
        <h2 className="selected-users-display-title">Selected Users</h2>
        <div className="selected-users-display-list-container">
          <div className="overlay" />
          <div className="selected-users-display-list">
            {selectedUsernames.length > 0 ? (
              <SeperatedList
                items={selectedUsernames.map((username) => ({
                  id: username,
                }))}
                ItemRenderElement={({ item }) => (
                  <SelectedUserView username={item.id} />
                )}
              />
            ) : (
              <div>*cricket noise</div>
            )}
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary">Cancel</Button>
        <Button
          variant="primary"
          disabled={selectedUsernames.length === 0}
          onClick={() =>
            createMultiGroup(selectedUsernames, groupName).then((group) => {
              onHide();
              onCreated?.(group);
            })
          }
        >
          Create
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

interface SelectedUserViewProps {
  username: string;
}
function SelectedUserView({ username }: SelectedUserViewProps) {
  return <div className="selected-user-view">{username}</div>;
}
