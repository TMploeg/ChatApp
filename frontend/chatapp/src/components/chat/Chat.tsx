import { ReactElement, useEffect, useState } from "react";
import { useAppNavigate, useStorage } from "../../hooks";
import Message, { NewMessage } from "../../models/message";
import { JWT } from "../../models/auth";
import { StorageLocation } from "../../enums/StorageLocation";
import "./Chat.scss";
import { Button, Form, InputGroup } from "react-bootstrap";
import { BsSendFill } from "react-icons/bs";
import AppRoute from "../../enums/AppRoute";
import ChatMessage from "./ChatMessage";
import ChatDateDivider from "./ChatDateDivider";

interface Props {
  messages: Message[];
  onSendMessage: (message: NewMessage) => void;
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
        <div className="chat-messages">{getMessageViews()}</div>
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

    onSendMessage({ content: newMessage });

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

  function getMessageViews(): ReactElement {
    const views: ReactElement[] = [];

    let index = 0;
    for (let message of messages) {
      views.push(
        <ChatMessage
          message={message}
          isOwned={message.sender === username}
          key={index}
        />
      );

      const isLastMessageForDate =
        index + 1 === messages.length ||
        message.sendAt.date !== messages[index + 1].sendAt.date;

      if (isLastMessageForDate) {
        views.push(getDividerForDate(new Date(message.sendAt.date)));
      }

      index++;
    }

    return <>{views}</>;
  }

  function getDividerForDate(date: Date) {
    return (
      <ChatDateDivider
        key={date.toLocaleDateString()}
        date={
          isToday(date)
            ? "Today"
            : date.toLocaleString("default", {
                month: "long",
              }) +
              " " +
              date.getDate() +
              ", " +
              date.getFullYear()
        }
      />
    );
  }

  function isToday(date: Date) {
    const now = new Date();

    return (
      now.getUTCFullYear() === date.getUTCFullYear() &&
      now.getUTCMonth() === date.getUTCMonth() &&
      now.getUTCDate() === date.getUTCDate()
    );
  }
}
