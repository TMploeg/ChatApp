package com.tmploeg.chatapp.messaging;

import java.util.function.Supplier;
import lombok.Getter;

@Getter
public class StompBroker {
  public static final StompBroker CHAT = new StompBroker("/queue/chat");
  public static final StompBroker CONNECTION_REQUESTS =
      new StompBroker("/queue/connection-requests");

  private final String route;

  private StompBroker(String route) {
    this.route = route;
  }
}
