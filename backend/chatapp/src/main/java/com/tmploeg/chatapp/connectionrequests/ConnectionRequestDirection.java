package com.tmploeg.chatapp.connectionrequests;

import java.util.Optional;

public enum ConnectionRequestDirection {
  ALL,
  SEND,
  RECEIVED;

  public static Optional<ConnectionRequestDirection> tryParse(String rawValue) {
    for (ConnectionRequestDirection dir : ConnectionRequestDirection.values()) {
      if (dir.name().equalsIgnoreCase(rawValue)) {
        return Optional.of(dir);
      }
    }

    return Optional.empty();
  }
}
