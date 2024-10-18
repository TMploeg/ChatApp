import { useEffect, useState } from "react";
import { useAppNavigate, useStorage } from "../../hooks";
import Message from "../../models/message";
import { JWT } from "../../models/auth";
import { StorageLocation } from "../../enums/StorageLocation";
import "./Chat.scss";
import { Button, Form, InputGroup } from "react-bootstrap";
import { BsSendFill } from "react-icons/bs";
import AppRoute from "../../enums/AppRoute";
import ChatMessage from "./ChatMessage";

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
        <div className="chat-messages">
          {messages.map((message, index) => (
            <ChatMessage
              message={message}
              isOwned={message.sender === username}
              key={index}
            />
          ))}
        </div>
        <div className="new-message-input-container">
          <InputGroup className="new-message-input">
            <Form.Control
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyUp={(e) => handleInputKeyUp(e.key)}
            />
            <Button size="lg" onClick={handleSendClicked}>
              <BsSendFill />
            </Button>
          </InputGroup>
        </div>
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

  function handleInputKeyUp(key: string) {
    switch (key) {
      case "Enter":
        handleSendClicked();
        break;
      default:
        break;
    }
  }
}
