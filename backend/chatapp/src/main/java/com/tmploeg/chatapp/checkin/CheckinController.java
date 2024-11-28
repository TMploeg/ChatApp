package com.tmploeg.chatapp.checkin;

import com.tmploeg.chatapp.ApiRoutes;
import com.tmploeg.chatapp.connectionrequests.*;
import com.tmploeg.chatapp.connectionrequests.dtos.ConnectionRequestDTO;
import com.tmploeg.chatapp.security.AuthenticationProvider;
import com.tmploeg.chatapp.users.User;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.data.jpa.domain.Specification;
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

    List<ConnectionRequestDTO> newRequests =
        connectionRequestService
            .filterAll(
                Specification.allOf(
                    ConnectionRequestSpecificationFactory.hasUser(
                        user, ConnectionRequestDirection.INCOMING),
                    ConnectionRequestSpecificationFactory.inState(ConnectionRequestState.SEND)))
            .stream()
            .map(request -> ConnectionRequestDTO.from(request, user))
            .toList();

    return new CheckinDTO(newRequests);
  }
}
