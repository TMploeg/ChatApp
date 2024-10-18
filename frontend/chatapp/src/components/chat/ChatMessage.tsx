import Message from "../../models/message";

interface Props {
  message: Message;
  isOwned: boolean;
}
export default function ChatMessage({ message, isOwned }: Props) {
  return (
    <div className={`chat-message ${isOwned ? "owned" : ""}`}>
      {!isOwned && (
        <div className="chat-message-username">{message.sender}</div>
      )}
      <div className="chat-message-content">{message.content}</div>
    </div>
  );
}
