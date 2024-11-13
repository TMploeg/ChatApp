package com.tmploeg.chatapp.connectionrequests.dtos;

import com.tmploeg.chatapp.connectionrequests.ConnectionRequest;
import java.util.UUID;

public record ReceivedConnectionRequestDTO(UUID id, String senderUsername, String state) {
  public static ReceivedConnectionRequestDTO from(ConnectionRequest request) {
    return new ReceivedConnectionRequestDTO(
        request.getId(), request.getConnector().getUsername(), request.getState().toString());
  }
}
