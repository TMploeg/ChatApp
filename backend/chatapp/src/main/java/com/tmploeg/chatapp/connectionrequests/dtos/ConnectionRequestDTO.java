package com.tmploeg.chatapp.connectionrequests.dtos;

import com.tmploeg.chatapp.connectionrequests.ConnectionRequest;
import java.util.UUID;

public record ConnectionRequestDTO(UUID id, String username, String state) {
  public static ConnectionRequestDTO from(ConnectionRequest request) {
    return new ConnectionRequestDTO(
        request.getId(), request.getConnector().getUsername(), request.getState().toString());
  }
}
