import { ActivationState, CompatClient, Stomp } from "@stomp/stompjs";
import { useState } from "react";

export default function useWebSocket() {
  const [stompClient, setStompClient] = useState<CompatClient>();
  const [handleConnected, setHandleConnected] = useState<() => void>(() => {});

  function connect() {
    const ws = new WebSocket(import.meta.env.VITE_WEBSOCKET_URL);

    const stompClient = Stomp.over(ws);
    stompClient.connect({}, handleConnected);

    setStompClient(stompClient);
  }

  function disconnect() {
    if (!stompClient) {
      return;
    }

    if (stompClient.state === ActivationState.ACTIVE) {
      stompClient.disconnect();
      setStompClient(undefined);
    } else {
      console.warn("cannot disconnect: already disconnected");
    }
  }

  function send(message: string) {
    if (!stompClient || stompClient.state !== ActivationState.ACTIVE) {
      console.error("cannot send message when not connected");
      return;
    }

    stompClient.publish({ destination: "/app/send", body: message });
  }

  function subscribe(destination: string) {}

  function onConnected(handler: () => void) {
    setHandleConnected(handler);
  }

  return { connect, disconnect, send, subscribe, onConnected };
}
