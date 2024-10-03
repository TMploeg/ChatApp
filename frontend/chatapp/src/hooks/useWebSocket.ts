import { ActivationState, CompatClient, Stomp } from "@stomp/stompjs";
import { useEffect, useState } from "react";

export default function useWebSocket() {
  const [stompClient, setStompClient] = useState<CompatClient>(
    Stomp.client(import.meta.env.VITE_WEBSOCKET_URL)
  );

    const stompClient = Stomp.over(ws);
    stompClient.connect({}, handleConnected);
  useEffect(() => {
    stompClient.configure({
      connectHeaders: {},
    });
  }, []);

  function connect() {
    stompClient.activate();
  }

  function disconnect() {
    if (stompClient.state !== ActivationState.ACTIVE) {
      console.warn("cannot disconnect: already disconnected");
      return;
    }

    stompClient.deactivate();
  }

  function send(content: string, destination: string) {
    if (stompClient.state !== ActivationState.ACTIVE) {
      console.error("cannot send message when not connected");
      return;
    }

    stompClient.publish({ destination: `/app/${destination}`, body: content });
  }
  return { connect, disconnect, send };
}
