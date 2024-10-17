import {
  ActivationState,
  Client,
  Stomp,
  StompSubscription,
} from "@stomp/stompjs";
import { useState } from "react";
import useStorage from "./useStorage";
import { StorageLocation } from "../enums/StorageLocation";
import { JWT } from "../models/auth";

const AUTH_HEADER_NAME: string = "Authorization";
const HEARTBEAT_INTERVAL_DELAY: number = 180000;
const APP_DESTINATION = "/app";

export interface WebSocketConfig {
  enableDebug?: boolean;
  enableHeartbeat?: boolean;
  onConnect: () => void;
  onDisconnect: () => void;
}
export default function useWebSocket(config?: WebSocketConfig): Socket {
  const [stompClient] = useState<Client>(getClient(config));

  const { get: getJWT } = useStorage<JWT>(StorageLocation.JWT);

  function connect() {
    if (stompClient.state !== ActivationState.INACTIVE) {
      console.warn("cannot connect: already connected");
      return;
    }

    stompClient.activate();
  }

  function disconnect() {
    if (stompClient.state !== ActivationState.ACTIVE) {
      console.warn("cannot disconnect: already disconnected");
      return;
    }

    stompClient.deactivate();
  }

  function send(destination: string, content: string) {
    if (stompClient.state !== ActivationState.ACTIVE) {
      throw new Error("cannot send message when not connected");
    }

    stompClient.publish({
      destination: APP_DESTINATION + destination,
      body: content,
    });
  }

  function subscribe<TMessage>(
    destination: string,
    callback: (message: TMessage) => void
  ) {
    if (stompClient.state !== ActivationState.ACTIVE) {
      throw new Error("cannot subscribe when not connected");
    }

    return stompClient.subscribe(destination, (message) =>
      callback(JSON.parse(message.body))
    );
  }

  return {
    connect,
    disconnect,
    send,
    subscribe,
  };

  function getClient(config?: WebSocketConfig): Client {
    const client = Stomp.client(import.meta.env.VITE_WEBSOCKET_URL);

    if (!config?.enableDebug) {
      client.debug = () => {};
    }

    const jwt = getJWT();
    if (!jwt) {
      throw new Error("auth token missing");
    }

    const headers: any = {};
    headers[AUTH_HEADER_NAME] = jwt.token;

    client.configure({
      connectHeaders: headers,
      heartbeatOutgoing: HEARTBEAT_INTERVAL_DELAY,
      onConnect: () => {
        config?.onConnect?.();
      },
      onDisconnect: () => {
        config?.onDisconnect?.();
      },
    });

    return client;
  }
}

export interface Socket {
  connect: () => void;
  disconnect: () => void;
  send: (destination: string, content: string) => void;
  subscribe: <T>(
    destination: string,
    callback: (message: T) => void
  ) => StompSubscription;
}
