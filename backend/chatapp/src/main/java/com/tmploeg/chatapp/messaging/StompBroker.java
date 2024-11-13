package com.tmploeg.chatapp.messaging;

public enum StompBroker {
  CHAT,
  CONNECTION_REQUESTS("/queue");

  private String prefix;

  private StompBroker() {
    this.prefix = "";
  }

  private StompBroker(String prefix) {
    this.prefix = prefix;
  }

  public String getRoute() {
    return prefix + "/" + name().toLowerCase().replace('_', '-');
  }

  public static String[] getAllRoutes() {
    StompBroker[] brokers = StompBroker.values();
    String[] routes = new String[brokers.length];

    int i = 0;
    for (StompBroker broker : brokers) {
      routes[i] = broker.getRoute();
      i++;
    }

    return routes;
  }
}
