package com.tmploeg.chatapp.checkin;

import com.tmploeg.chatapp.connectionrequests.dtos.ReceivedConnectionRequestDTO;
import java.util.List;

public record CheckinDTO(List<ReceivedConnectionRequestDTO> newConnectionRequests) {}
