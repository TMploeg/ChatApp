import { useEffect, useState } from "react";
import { Socket } from "../../../hooks/useWebSocket";
import Message from "../../../models/message";
import "../Chat.css";
import { ClipLoader } from "react-spinners";
import { useStorage } from "../../../hooks";
import { JWT } from "../../../models/auth";
import { StorageLocation } from "../../../enums/StorageLocation";
import { useNavigate } from "react-router-dom";

interface Props {
  socket: Socket;
  connected: boolean;
  history?: Message[];
  clearHistory: () => void;
}
export default function GlobalChatPage({
  socket,
  connected,
  history,
  clearHistory,
}: Props) {
  const [messages, setMessages] = useState<Message[]>();
  const [newMessage, setNewMessage] = useState<string>("");
  const { get: getJWT, set: setJWT } = useStorage<JWT>(StorageLocation.JWT);
  const navigate = useNavigate();

  const [username, setUsername] = useState<string>();

  useEffect(() => {
    const jwt = getJWT();

    if (!jwt?.username) {
      console.error("username not found");
      setJWT(null);
      navigate("/");
      return;
    }

    setUsername(jwt.username);
  }, []);

  useEffect(() => {
    if (!connected) {
      return;
    }

    let subscription = socket.subscribe<Message>("/chat", handleNewMessage);

    return () => subscription.unsubscribe();
  }, [connected]);

  useEffect(() => {
    if (history === undefined) {
      return;
    }

    setMessages(history);
    clearHistory();
  }, [history]);

  if (messages === undefined) {
    return (
      <div>
        <ClipLoader />
      </div>
    );
  }

  return (
    <div className="chat-container">
      <div className="chat-title">Global Chat</div>
      <div className="new-message-input">
        <input
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <button onClick={send}>send</button>
      </div>
      <div className="chat-message-container">
        {messages.map((message) => (
          <div
            className={`chat-message ${
              message.sender === username ? "owned" : null
            }`}
          >
            {message.content}
          </div>
        ))}
      </div>
    </div>
  );

  function send() {
    socket.send("send", newMessage);
  }

  function handleNewMessage(message: Message) {
    console.log("NEW MESSAGE: ", message.content);

    setMessages((oldMessages) => {
      if (!oldMessages) {
        console.warn("can't handle new message: not initialized");
        return undefined;
      }

      return [message, ...oldMessages];
    });
  }
}
