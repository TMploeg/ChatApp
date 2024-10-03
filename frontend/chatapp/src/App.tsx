import { useEffect, useState } from "react";
import { useWebSocket } from "./hooks";

function App() {
  const { connect, disconnect, send } = useWebSocket();

  useEffect(() => {
    connect();

    return disconnect;
  }, []);

  return (
    <div className="roboto-light">
      <ChatInput onSubmit={sendMessage} />
    </div>
  );

  function sendMessage(message: string) {
    send(message, "send");
  }
}

export default App;

interface ChatInputProps {
  onSubmit?: (message: string) => void;
}
function ChatInput({ onSubmit }: ChatInputProps) {
  const [message, setMessage] = useState<string>("");

  return (
    <div className="chat-input">
      <input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyUp={handleInputKeyUp}
      />
    </div>
  );

  function handleInputKeyUp(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      onSubmit?.(message);
      setMessage("");
    }
  }
}
