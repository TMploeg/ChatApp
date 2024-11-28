package com.tmploeg.chatapp.connectionrequests.dtos;

import com.tmploeg.chatapp.connectionrequests.ConnectionRequest;
import com.tmploeg.chatapp.connectionrequests.ConnectionRequestDirection;
import com.tmploeg.chatapp.connectionrequests.ConnectionRequestState;
import com.tmploeg.chatapp.users.User;

public record ConnectionRequestDTO(String id, String subject, String state, String direction) {
  public static ConnectionRequestDTO from(ConnectionRequest request, User recipient) {
    ConnectionRequestDirection direction = getDirection(request, recipient);
    User subject = getSubject(request, direction);
    ConnectionRequestState state = getState(request, direction);

    return new ConnectionRequestDTO(
        request.getId().toString(), subject.getUsername(), state.toString(), direction.toString());
  }

  private static ConnectionRequestDirection getDirection(
      ConnectionRequest request, User recipient) {
    return request.getConnector().getUsername().equals(recipient.getUsername())
        ? ConnectionRequestDirection.OUTGOING
        : ConnectionRequestDirection.INCOMING;
  }

  private static User getSubject(ConnectionRequest request, ConnectionRequestDirection direction) {
    return switch (direction) {
      case OUTGOING -> request.getConnectee();
      case INCOMING -> request.getConnector();
      case TWO_WAY -> throw new RuntimeException("invalid direction");
    };
  }

  private static ConnectionRequestState getState(
      ConnectionRequest request, ConnectionRequestDirection direction) {
    return direction == ConnectionRequestDirection.OUTGOING
            && request.getState() == ConnectionRequestState.IGNORED
        ? ConnectionRequestState.SEEN
        : request.getState();
  }
}
