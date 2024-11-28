package com.tmploeg.chatapp.connectionrequests;

import java.util.Optional;

public enum ConnectionRequestDirection {
  TWO_WAY,
  INCOMING,
  OUTGOING;

  public static Optional<ConnectionRequestDirection> tryParse(String rawValue) {
    for (ConnectionRequestDirection dir : ConnectionRequestDirection.values()) {
      if (dir.name().equalsIgnoreCase(rawValue)) {
        return Optional.of(dir);
      }
    }

    return Optional.empty();
  }
}
