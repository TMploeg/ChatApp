import { Button, Form, Modal } from "react-bootstrap";
import { useAlert, useApi } from "../../../hooks";
import ApiRoute from "../../../enums/ApiRoute";
import { useState } from "react";

interface Props {
  show?: boolean;
  onHide?: () => void;
}
export default function SendConnectionRequestModal({ show, onHide }: Props) {
  const { post } = useApi();

  const [targetUsername, setTargetUsername] = useState<string>("");
  const [invalid, setInvalid] = useState<boolean>(false);

  const alert = useAlert();

  return (
    <Modal
      show={show}
      onHide={() => {
        onHide?.();
        setTargetUsername("");
      }}
    >
      <Modal.Header closeButton>Add User</Modal.Header>
      <Modal.Body className="send-connection-request-dialog-body">
        <div>
          Enter the username of the person you want to connect with to send a
          connection request
        </div>
        <Form.Group>
          <Form.Label>
            <strong>Username</strong>
          </Form.Label>
          <Form.Control
            type="text"
            value={targetUsername}
            onChange={(e) => handleUsernameChanged(e.target.value)}
            isInvalid={invalid}
            autoFocus
            onKeyUp={(e) => handleUsernameControlKeyUp(e.key)}
          />
          <Form.Control.Feedback type="invalid">
            username is invalid
          </Form.Control.Feedback>
        </Form.Group>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Close
        </Button>
        <Button onClick={sendRequest} disabled={!canSubmit()}>
          Send Request
        </Button>
      </Modal.Footer>
    </Modal>
  );

  function handleUsernameChanged(newUsername: string) {
    setTargetUsername(newUsername);
    setInvalid(false);
  }

  function handleUsernameControlKeyUp(key: string) {
    if (key === "Enter") {
      sendRequest();
    }
  }

  function sendRequest() {
    if (!canSubmit()) {
      return;
    }

    post<void>(ApiRoute.CONNECTION_REQUESTS(), {
      subject: targetUsername,
    })
      .then(() => {
        onHide?.();
        alert("Connection request send", "success");
      })
      .catch(showError);
  }

  function showError() {
    setInvalid(true);
  }

  function canSubmit() {
    return targetUsername.length > 0;
  }
}
