import { useEffect, useState } from "react";
import Message from "../../../models/message";
import { ClipLoader } from "react-spinners";
import Chat from "../Chat";
import { StompSubscription } from "@stomp/stompjs";
import { useApi } from "../../../hooks";
import ApiRoute from "../../../enums/ApiRoute";
import StompBroker from "../../../enums/StompBroker";

interface Props {
  subscribe: (
    destination: StompBroker,
    callback: (message: Message) => void
  ) => StompSubscription;
}
export default function GlobalChatPage({ subscribe }: Props) {
  const [messages, setMessages] = useState<Message[]>();

  const { get, post } = useApi();

  useEffect(() => {
    let subscription = subscribe(StompBroker.CHAT, handleNewMessage);
    get<Message[]>(ApiRoute.CHAT).then(setMessages);

    return () => subscription.unsubscribe();
  }, []);

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
      onSendMessage={(message) => post(ApiRoute.CHAT, message)}
      titleText="Global Chat"
    />
  );

  function handleNewMessage(message: Message) {
    setMessages((oldMessages) => {
      if (!oldMessages) {
        return undefined;
      }

      return [message, ...oldMessages];
    });
  }
}
