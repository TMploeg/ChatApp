import {
  ActivationState,
  Client,
  Stomp,
  StompSubscription,
} from "@stomp/stompjs";
import { useState } from "react";
import StompBroker from "../enums/StompBroker";
import useToken from "./useToken";

const HEARTBEAT_INTERVAL_DELAY: number = 180000;

export interface WebSocketConfig {
  enableDebug?: boolean;
  onConnect?: () => void;
  onDisconnect?: () => void;
}
export default function useWebSocket(): Socket {
  const [stompClient] = useState<Client>(getClient());
  const getToken = useToken();

  function connect(config?: WebSocketConfig) {
    if (stompClient.state !== ActivationState.INACTIVE) {
      console.warn("cannot connect: already connected");
      return;
    }

    configureClient(config);

    stompClient.activate();
  }

  function disconnect() {
    if (stompClient.state !== ActivationState.ACTIVE) {
      console.warn("cannot disconnect: already disconnected");
      return;
    }

    stompClient.deactivate();
  }

  function subscribe<TMessage>(
    destination: StompBroker,
    callback: (message: TMessage) => void
  ) {
    if (stompClient.state !== ActivationState.ACTIVE) {
      throw new Error("cannot subscribe when not connected");
    }

    return stompClient.subscribe(destination.getPath(), (message) =>
      callback(JSON.parse(message.body))
    );
  }

  return {
    connect,
    disconnect,
    subscribe,
  };

  function getClient(): Client {
    const client = Stomp.client(import.meta.env.VITE_WEBSOCKET_URL);

    return client;
  }

  function configureClient(config?: WebSocketConfig) {
    if (!config?.enableDebug) {
      stompClient.debug = () => {};
    }

    const token = getToken();
    if (!token) {
      throw new Error("auth token missing");
    }

    const headers: any = {
      Authorization: token,
    };

    stompClient.configure({
      connectHeaders: headers,
      heartbeatOutgoing: HEARTBEAT_INTERVAL_DELAY,
      onConnect: config?.onConnect,
      onDisconnect: config?.onDisconnect,
    });
  }
}

export interface Socket {
  connect: (config?: WebSocketConfig) => void;
  disconnect: () => void;
  subscribe: <T>(
    destination: StompBroker,
    callback: (message: T) => void
  ) => StompSubscription;
}
