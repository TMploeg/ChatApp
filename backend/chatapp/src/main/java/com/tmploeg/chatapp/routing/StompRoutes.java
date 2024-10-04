package com.tmploeg.chatapp.routing;

public final class StompRoutes {
  public static final String ENDPOINT = "/ws";
  public static final String[] BROKERS = StompBrokers.getAll();
  public static final String APP_DESTINATION = "/app";
  public static final String USER_DESTINATION = "/user";
}
