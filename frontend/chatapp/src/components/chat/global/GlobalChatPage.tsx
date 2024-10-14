import { useEffect, useState } from "react";
import { Socket } from "../../../hooks/useWebSocket";
import Message from "../../../models/message";
import { ClipLoader } from "react-spinners";
import Chat from "../Chat";

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
        <ClipLoader color="#3388ff" />
      </div>
    );
  }

  return (
    <Chat messages={messages} onSendMessage={send} titleText="Global Chat" />
  );

  function send(message: string) {
    socket.send("send", message);
  }

  function handleNewMessage(message: Message) {
    setMessages((oldMessages) => {
      if (!oldMessages) {
        console.warn("can't handle new message: not initialized");
        return undefined;
      }

      return [message, ...oldMessages];
    });
  }
}
