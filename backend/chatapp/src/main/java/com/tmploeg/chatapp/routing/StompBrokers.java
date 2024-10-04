package com.tmploeg.chatapp.routing;

public final class StompBrokers {
  public static final String CHAT = "/chat";

  public static String[] getAll() {
    return new String[] {CHAT};
  }
}
