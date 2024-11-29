package com.tmploeg.chatapp.checkin;

import com.tmploeg.chatapp.ApiRoutes;
import com.tmploeg.chatapp.connectionrequests.*;
import com.tmploeg.chatapp.connectionrequests.dtos.ConnectionRequestDTO;
import com.tmploeg.chatapp.security.AuthenticationProvider;
import com.tmploeg.chatapp.users.User;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(ApiRoutes.CHECKIN)
@RequiredArgsConstructor
@CrossOrigin("${app.cors}")
public class CheckinController {
  private final AuthenticationProvider authenticationProvider;
  private final ConnectionRequestService connectionRequestService;

  @GetMapping
  public CheckinDTO checkin() {
    User user = authenticationProvider.getAuthenticatedUser();

    List<ConnectionRequest> newRequests =
        connectionRequestService.findAll(
            (configurer) -> {
              configurer.hasUser(user, ConnectionRequestDirection.INCOMING);
              configurer.inState(ConnectionRequestState.SEND);
            });

    return new CheckinDTO(
        newRequests.stream().map(request -> ConnectionRequestDTO.from(request, user)).toList());
  }
}
