package com.tmploeg.chatapp.messaging;

import lombok.Getter;

@Getter
public class Broker {
  public static final Broker CHAT = new Broker("/queue/chat");
  public static final Broker CONNECTION_REQUESTS = new Broker("/queue/connection-requests");
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
    String[] destinations = new String[3];

    destinations[0] = CHAT.getDestination();
    destinations[1] = CONNECTION_REQUESTS.getDestination();
    destinations[2] = CHAT_GROUPS.getDestination();

    return destinations;
  }
}
