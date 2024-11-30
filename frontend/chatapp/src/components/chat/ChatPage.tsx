import { useContext, useEffect, useState } from "react";
import Message from "../../models/message";
import { ClipLoader } from "react-spinners";
import Chat from "./Chat";
import { useApi, useAppNavigate } from "../../hooks";
import ApiRoute from "../../enums/ApiRoute";
import { useParams } from "react-router-dom";
import AppRoute from "../../enums/AppRoute";
import { SubscriptionContext } from "../../context";
import StompBroker from "../../enums/StompBroker";

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>();

  const { get, post } = useApi();
  const navigate = useAppNavigate();
  const { id } = useParams();

  const subscriptions = useContext(SubscriptionContext);

  if (!id) {
    navigate(AppRoute.HOME);
    return;
  }

  useEffect(() => {
    const subscription = subscriptions.subscribe<Message>(
      StompBroker.CHAT,
      (message) => handleNewMessage(message)
    );

    get<Message[]>(ApiRoute.CHAT(), { groupId: id })
      .then(setMessages)
      .catch(() => navigate(AppRoute.HOME));

    return () => {
      setMessages(undefined);
      subscription.unsubscribe();
    };
  }, [id]);

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
      onSendMessage={(message) =>
        post(ApiRoute.CHAT(), message, { groupId: id })
      }
    />
  );

  function handleNewMessage(message: Message) {
    if (id != message.groupId) {
      return;
    }

    setMessages((oldMessages) => {
      if (!oldMessages) {
        return undefined;
      }

      return [message, ...oldMessages];
    });
  }
}
