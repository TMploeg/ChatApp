import { useEffect, useState } from "react";
import { Button, Dropdown, Form, FormGroup, Modal } from "react-bootstrap";
import Connection from "../../../models/connection";
import { useApi, useChatGroups } from "../../../hooks";
import ApiRoute from "../../../enums/ApiRoute";
import { ClipLoader } from "react-spinners";
import SeperatedList from "../../generic/seperated-list/SeperatedList";
import "./AddGroupChatDialog.scss";
import ChatGroup from "../../../models/chat-group";
import { BsPersonFill, BsXLg } from "react-icons/bs";

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

  const visibleConnections = connections?.filter(
    (c) => !selectedUsernames.includes(c.username)
  );
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

        {visibleConnections ? (
          <Dropdown>
            <Dropdown.Toggle
              className="connection-select-toggle"
              disabled={visibleConnections.length === 0}
              variant={visibleConnections.length > 0 ? "primary" : "secondary"}
            >
              {visibleConnections.length > 0
                ? "Select Users"
                : "No Connections Left"}
            </Dropdown.Toggle>
            <Dropdown.Menu className="connection-select-menu">
              {visibleConnections.map((connection) => (
                <Dropdown.Item
                  key={connection.username}
                  onClick={() => addUsername(connection.username)}
                >
                  {connection.username}
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>
        ) : (
          <ClipLoader color="white" />
        )}
        <h2 className="selected-users-display-title">Selected Users</h2>
        <div className="selected-users-display-list-container">
          <div className="overlay" />
          {selectedUsernames.length > 0 && (
            <div className="selected-users-display-list">
              <SeperatedList
                items={selectedUsernames.map((username) => ({
                  id: username,
                }))}
                ItemRenderElement={({ item: { id: username } }) => (
                  <SelectedUserView
                    username={username}
                    onDelete={() => removeUsername(username)}
                  />
                )}
              />
            </div>
          )}
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => onHide()}>
          Cancel
        </Button>
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

  function addUsername(username: string) {
    setSelectedUsernames((usernames) => [username, ...usernames]);
  }

  function removeUsername(username: string) {
    setSelectedUsernames((usernames) => {
      const usernameIndex = usernames.indexOf(username);

      if (usernameIndex < 0) {
        return usernames;
      }

      return usernames
        .slice(0, usernameIndex)
        .concat(usernames.slice(usernameIndex + 1));
    });
  }
}

interface SelectedUserViewProps {
  username: string;
  onDelete: () => void;
}
function SelectedUserView({ username, onDelete }: SelectedUserViewProps) {
  return (
    <div className="selected-user-view">
      <div className="selected-user-info">
        <BsPersonFill size="1.3em" />
        <div>{username}</div>
      </div>
      <Button
        variant="outline"
        className="selected-user-delete-button"
        onClick={onDelete}
      >
        <BsXLg size="1.3em" />
      </Button>
    </div>
  );
}
