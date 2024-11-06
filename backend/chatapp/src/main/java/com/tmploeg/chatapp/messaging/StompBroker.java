package com.tmploeg.chatapp.messaging;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

public enum StompBroker {
  CHAT;

  public String getRoute() {
    return "/" + name().toLowerCase().replace('_', '-');
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
