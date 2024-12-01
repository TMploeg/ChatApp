package com.tmploeg.chatapp.connectionrequests.dtos;

import com.tmploeg.chatapp.connectionrequests.ConnectionRequest;
import com.tmploeg.chatapp.connectionrequests.ConnectionRequestState;

public record ConnectionRequestDTO(String id, String subject, boolean seen) {
  public static ConnectionRequestDTO from(ConnectionRequest request) {
    return new ConnectionRequestDTO(
        request.getId().toString(),
        request.getConnector().getUsername(),
        request.getState() == ConnectionRequestState.SEEN);
  }
}
