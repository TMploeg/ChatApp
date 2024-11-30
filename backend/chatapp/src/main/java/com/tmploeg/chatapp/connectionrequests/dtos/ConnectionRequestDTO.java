package com.tmploeg.chatapp.connectionrequests.dtos;

import com.tmploeg.chatapp.connectionrequests.ConnectionRequest;
import com.tmploeg.chatapp.connectionrequests.ConnectionRequestDirection;
import com.tmploeg.chatapp.users.User;

public record ConnectionRequestDTO(String id, String subject, String state, String direction) {
  public static ConnectionRequestDTO from(
      ConnectionRequest request, ConnectionRequestDirection direction) {
    return new ConnectionRequestDTO(
        request.getId().toString(),
        getSubject(request, direction).getUsername(),
        request.getState().toString(),
        direction.toString());
  }

  private static User getSubject(ConnectionRequest request, ConnectionRequestDirection direction) {
    return switch (direction) {
      case INCOMING -> request.getConnector();
      case OUTGOING -> request.getConnectee();
      case TWO_WAY -> throw new RuntimeException("invalid state");
    };
  }
}
