import { useEffect, useState } from "react";
import { Socket } from "../../../hooks/useWebSocket";
import { IMessage } from "@stomp/stompjs";
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
}
export default function GlobalChatPage({ socket, connected }: Props) {
  const [messages, setMessages] = useState<Message[]>([]);
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

    const subscription = socket.subscribe<Message>("/chat", addMessage);

    return () => subscription.unsubscribe();
  }, [connected]);

  if (isLoading()) {
    return (
      <div>
        <ClipLoader />;
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
          <div className="chat-message">{message.content}</div>
        ))}
      </div>
    </div>
  );

  function isLoading(): boolean {
    return !connected || username === undefined;
  }

  function send() {
    socket.send("send", newMessage);
  }

  function addMessage(message: Message) {
    setMessages((oldMessages) => {
      return [message, ...oldMessages];
    });
  }
}
