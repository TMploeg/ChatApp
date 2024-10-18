import Message from "../../models/message";

interface Props {
  message: Message;
  isOwned: boolean;
}
export default function ChatMessage({ message, isOwned }: Props) {
  return (
    <div className={`chat-message ${isOwned ? "owned" : null}`}>
      {message.content}
    </div>
  );
}
