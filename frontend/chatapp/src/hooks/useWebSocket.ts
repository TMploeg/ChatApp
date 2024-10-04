import {
  ActivationState,
  CompatClient,
  IMessage,
  Stomp,
  StompSubscription,
} from "@stomp/stompjs";
import { useEffect, useState } from "react";
import useStorage from "./useStorage";
import { StorageLocation } from "../enums/StorageLocation";
import { JWT } from "../models/auth";

const AUTH_HEADER_NAME = "Authorization";

export default function useWebSocket(): Socket {
  const [stompClient] = useState<CompatClient>(
    Stomp.client(import.meta.env.VITE_WEBSOCKET_URL)
  );
  const { get: getJWT } = useStorage<JWT>(StorageLocation.JWT);

  function connect() {
    const jwt = getJWT();
    if (!jwt) {
      console.error("auth token missing");
      return;
    }

    const headers: any = {};
    headers[AUTH_HEADER_NAME] = jwt.token;

    stompClient.configure({ connectHeaders: headers });
    stompClient.activate();
  }

  function onConnect(callback: () => void) {
    stompClient.onConnect = callback;
  }

  function disconnect() {
    if (stompClient.state !== ActivationState.ACTIVE) {
      console.warn("cannot disconnect: already disconnected");
      return;
    }

    stompClient.deactivate();
  }

  function onDisconnect(callBack: () => void) {
    stompClient.onDisconnect = callBack;
  }

  function send(destination: string, content: string) {
    if (stompClient.state !== ActivationState.ACTIVE) {
      console.error("cannot send message when not connected");
      return;
    }
    stompClient.publish({ destination: `/app/${destination}`, body: content });
  }

  function subscribe<TMessage>(
    destination: string,
    callback: (message: TMessage) => void
  ) {
    return stompClient.subscribe(destination, (message) =>
      callback(JSON.parse(message.body))
    );
  }

  return {
    connect,
    onConnect,
    disconnect,
    onDisconnect,
    send,
    subscribe,
  };
}

export interface Socket {
  connect: () => void;
  onConnect: (callBack: () => void) => void;
  disconnect: () => void;
  onDisconnect: (callBack: () => void) => void;
  send: (destination: string, content: string) => void;
  subscribe: <T>(
    destination: string,
    callback: (message: T) => void
  ) => StompSubscription;
}
