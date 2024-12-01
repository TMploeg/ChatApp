package com.tmploeg.chatapp.messaging;

import lombok.Getter;

@Getter
public class Broker {
  public static final Broker CHAT = new Broker("/queue/chat");
  public static final Broker SEND_CONNECTION_REQUESTS =
      new Broker("/queue/connection-requests/send");
  public static final Broker ANSWERED_CONNECTION_REQUESTS =
      new Broker("/queue/connection-requests/answered");
  public static final Broker CHAT_GROUPS = new Broker("/queue/chatgroups");

  private final String destination;

  private Broker(String destination) {
    this.destination = destination;
  }

  public Broker withSubDestination(String subDestination) {
    if (!subDestination.startsWith("/")) {
      throw new IllegalArgumentException("subDestination must start with '/'");
    }
    return new Broker(destination + subDestination);
  }

  public static String[] getAllDestinations() {
    String[] destinations = new String[4];

    destinations[0] = CHAT.getDestination();
    destinations[1] = SEND_CONNECTION_REQUESTS.getDestination();
    destinations[2] = ANSWERED_CONNECTION_REQUESTS.getDestination();
    destinations[3] = CHAT_GROUPS.getDestination();

    return destinations;
  }
}
