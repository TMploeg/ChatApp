package com.tmploeg.chatapp.checkin;

import com.tmploeg.chatapp.connectionrequests.dtos.ConnectionRequestDTO;
import java.util.List;

public record CheckinDTO(List<ConnectionRequestDTO> newConnectionRequests) {}
