package com.tmploeg.chatapp.connectionrequests.dtos;

import com.tmploeg.chatapp.connectionrequests.ConnectionRequestState;

public record ConnectionRequestDTO(String username, ConnectionRequestState state) {}
