import { KeyboardEventHandler, useEffect, useState } from "react";
import { useWebSocket } from "./hooks";

function App() {
  const { connect, disconnect, send, onConnected } = useWebSocket();
  const [connected, setConnected] = useState<boolean>(false);

  useEffect(() => {
    connect();
    onConnected(() => setConnected(true));

    return disconnect;
  }, []);

  return (
    <div className="roboto-light">
      <ChatInput onSubmit={sendMessage} />
    </div>
  );

  function sendMessage(message: string) {
    if (connected) {
      send(message);
    }
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
