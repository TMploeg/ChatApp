import { useEffect, useState } from "react";
import Message from "../../../models/message";
import { ClipLoader } from "react-spinners";
import Chat from "../Chat";
import { StompSubscription } from "@stomp/stompjs";

const SEND_MESSAGE_DESTINATION = "/send";

interface Props {
  subscribe: (
    destination: string,
    callback: (message: Message) => void
  ) => StompSubscription;
  send: (destination: string, message: string) => void;
  history?: Message[];
  clearHistory: () => void;
}
export default function GlobalChatPage({
  subscribe,
  send,
  history,
  clearHistory,
}: Props) {
  const [messages, setMessages] = useState<Message[]>();

  useEffect(() => {
    let subscription = subscribe("/chat", handleNewMessage);

    return () => subscription.unsubscribe();
  }, []);

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
    <Chat
      messages={messages}
      onSendMessage={(message) => send(SEND_MESSAGE_DESTINATION, message)}
      titleText="Global Chat"
    />
  );

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
