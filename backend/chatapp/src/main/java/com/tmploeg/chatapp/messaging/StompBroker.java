package com.tmploeg.chatapp.messaging;

import lombok.Getter;

@Getter
public class StompBroker {
  public static final StompBroker CHAT = new StompBroker("/queue/chat");
  public static final StompBroker CONNECTION_REQUESTS =
      new StompBroker("/queue/connection-requests");
  public static final StompBroker CHAT_GROUPS = new StompBroker("/queue/chatgroups");

  private final String route;

  private StompBroker(String route) {
    this.route = route;
  }

  public static String[] getAllRoutes() {
    String[] routes = new String[3];

    routes[0] = (CHAT.getRoute());
    routes[1] = (CONNECTION_REQUESTS.getRoute());
    routes[2] = (CHAT_GROUPS.getRoute());

    return routes;
  }
}
