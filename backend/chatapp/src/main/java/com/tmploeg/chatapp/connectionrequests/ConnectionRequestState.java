package com.tmploeg.chatapp.connectionrequests;

import java.util.Optional;

public enum ConnectionRequestState {
  SEND,
  SEEN,
  REJECTED,
  IGNORED,
  ACCEPTED;

  public static Optional<ConnectionRequestState> tryParse(String rawValue) {
    if (rawValue == null) {
      return Optional.empty();
    }

    for (ConnectionRequestState state : ConnectionRequestState.values()) {
      if (state.name().equalsIgnoreCase(rawValue)) {
        return Optional.of(state);
      }
    }

    return Optional.empty();
  }
}
