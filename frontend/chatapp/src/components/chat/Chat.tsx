import { useEffect, useState } from "react";
import { useAppNavigate, useStorage } from "../../hooks";
import Message from "../../models/message";
import { JWT } from "../../models/auth";
import { StorageLocation } from "../../enums/StorageLocation";
import "./Chat.css";
import { Button, Form, InputGroup } from "react-bootstrap";
import { BsSendFill } from "react-icons/bs";
import AppRoute from "../../enums/AppRoute";

interface Props {
  messages: Message[];
  onSendMessage: (message: string) => void;
  titleText?: string;
}
export default function Chat({ messages, onSendMessage, titleText }: Props) {
  const [username, setUsername] = useState<string>();
  const [newMessage, setNewMessage] = useState<string>("");

  const { get: getJWT, set: setJWT } = useStorage<JWT>(StorageLocation.JWT);
  const navigate = useAppNavigate();

  useEffect(() => {
    const jwt = getJWT();

    if (!jwt?.username) {
      console.error("username not found");
      setJWT(null);
      navigate(AppRoute.HOME);
      return;
    }

    setUsername(jwt.username);
  }, []);

  return (
    <div className="chat-container">
      {titleText && <div className="chat-title">{titleText}</div>}
      <div className="chat-message-container">
        {messages.map((message, index) => (
          <div
            className={`chat-message ${
              message.sender === username ? "owned" : null
            }`}
            key={index}
          >
            {message.content}
          </div>
        ))}
      </div>
      <div className="new-message-input-container">
        <InputGroup className="new-message-input">
          <Form.Control
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
          />
          <Button size="lg" onClick={handleSendClicked}>
            <BsSendFill />
          </Button>
        </InputGroup>
      </div>
    </div>
  );

  function handleSendClicked() {
    if (!username) {
      return;
    }

    onSendMessage(newMessage);

    setNewMessage("");
  }
}
