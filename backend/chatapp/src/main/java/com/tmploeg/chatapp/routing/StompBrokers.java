package com.tmploeg.chatapp.routing;

public final class StompBrokers {
  public static final String CHAT = "/chat";
  public static final String HISTORY = "/queue/history";

  public static String[] getAll() {
    return new String[] {CHAT, HISTORY};
  }
}
