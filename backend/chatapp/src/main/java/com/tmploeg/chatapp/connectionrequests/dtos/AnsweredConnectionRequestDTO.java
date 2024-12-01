package com.tmploeg.chatapp.connectionrequests.dtos;

import com.tmploeg.chatapp.connectionrequests.ConnectionRequest;
import com.tmploeg.chatapp.connectionrequests.ConnectionRequestState;

public record AnsweredConnectionRequestDTO(String id, String subject, boolean accepted) {
  public static AnsweredConnectionRequestDTO from(ConnectionRequest request) {
    return new AnsweredConnectionRequestDTO(
        request.getId().toString(),
        request.getConnectee().getUsername(),
        request.getState() == ConnectionRequestState.ACCEPTED);
  }
}
