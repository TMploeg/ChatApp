package com.tmploeg.chatapp.connectionrequests;

import com.tmploeg.chatapp.ApiRoutes;
import com.tmploeg.chatapp.connectionrequests.dtos.AnsweredConnectionRequestDTO;
import com.tmploeg.chatapp.connectionrequests.dtos.ConnectionRequestDTO;
import com.tmploeg.chatapp.connectionrequests.dtos.NewConnectionRequestDTO;
import com.tmploeg.chatapp.connectionrequests.dtos.UpdateConnectionRequestDTO;
import com.tmploeg.chatapp.dtos.page.PageDTO;
import com.tmploeg.chatapp.exceptions.BadRequestException;
import com.tmploeg.chatapp.exceptions.ForbiddenException;
import com.tmploeg.chatapp.exceptions.NotFoundException;
import com.tmploeg.chatapp.messaging.Broker;
import com.tmploeg.chatapp.messaging.MessagingService;
import com.tmploeg.chatapp.security.AuthenticationProvider;
import com.tmploeg.chatapp.users.User;
import com.tmploeg.chatapp.users.UserService;
import jakarta.transaction.Transactional;
import java.util.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping(ApiRoutes.CONNECTION_REQUESTS)
@RequiredArgsConstructor
@CrossOrigin("${app.cors}")
public class ConnectionRequestController {
  private final UserService userService;
  private final ConnectionRequestService connectionRequestService;
  private final MessagingService messagingService;
  private final AuthenticationProvider authenticationProvider;

  @GetMapping
  public PageDTO<ConnectionRequestDTO> getConnectionRequests(Pageable pageable) {
    if (pageable.getPageNumber() < 0) {
      throw new BadRequestException("page must be greater than or equal to 0");
    }
    if (pageable.getPageSize() < 1) {
      throw new BadRequestException("size must be greater than or equal to 1");
    }

    User user = authenticationProvider.getAuthenticatedUser();

    Page<ConnectionRequest> requests =
        connectionRequestService.findAll(
            (specificationConfigurer -> {
              specificationConfigurer.hasUser(user, ConnectionRequestDirection.INCOMING);
              specificationConfigurer.inState(
                  List.of(ConnectionRequestState.SEND, ConnectionRequestState.SEEN));
            }),
            pageable);

    return PageDTO.from(requests, ConnectionRequestDTO::from);
  }

  @PostMapping
  @ResponseStatus(HttpStatus.NO_CONTENT)
  public void sendConnectionRequest(@RequestBody NewConnectionRequestDTO connectionRequestDTO) {
    if (connectionRequestDTO.subject() == null) {
      throw new BadRequestException("subject is required");
    }
    if (connectionRequestDTO.subject().isBlank()) {
      throw new BadRequestException("subject can't be blank");
    }

    User connector = authenticationProvider.getAuthenticatedUser();

    if (connector.getUsername().equals(connectionRequestDTO.subject())) {
      throw new BadRequestException("can't send connection request to self");
    }

    User connectee =
        userService
            .findByUsername(connectionRequestDTO.subject())
            .orElseThrow(
                () ->
                    new BadRequestException(
                        "user '" + connectionRequestDTO.subject() + "' does not exist"));

    if (connectionRequestService.recentRequestToConnecteeExists(connector, connectee)) {
      throw new ForbiddenException("too early to resend request");
    }

    ConnectionRequest request = connectionRequestService.save(connector, connectee);

    messagingService.sendToUser(
        connectee, Broker.SEND_CONNECTION_REQUESTS, ConnectionRequestDTO.from(request));
  }

  @PatchMapping("{id}")
  @ResponseStatus(HttpStatus.NO_CONTENT)
  @Transactional
  public void updateConnectionRequest(
      @RequestBody UpdateConnectionRequestDTO updateDTO, @PathVariable UUID id) {
    ConnectionRequest request =
        connectionRequestService
            .getByIdIfUserIsConnectee(id, authenticationProvider.getAuthenticatedUser())
            .orElseThrow(NotFoundException::new);

    if (updateDTO.state() != null) {
      updateState(request, updateDTO.state());
    }
  }

  private void updateState(ConnectionRequest request, String newState) {
    String unrecognizedStateMessage = "state '" + newState + "' is not recognized";
    String invalidStateMessage = "state '" + newState + "' is invalid for this request";

    ConnectionRequestState state =
        ConnectionRequestState.tryParse(newState)
            .orElseThrow(() -> new BadRequestException(unrecognizedStateMessage));

    switch (state) {
      case SEND:
        throw new BadRequestException(unrecognizedStateMessage);
      case SEEN:
        switch (request.getState()) {
          case SEND:
            request.setState(ConnectionRequestState.SEEN);
            connectionRequestService.update(request);
            break;
          case SEEN:
            break;
          default:
            throw new BadRequestException(invalidStateMessage);
        }
        break;
      case REJECTED:
      case IGNORED:
      case ACCEPTED:
        if (request.getState() != ConnectionRequestState.SEND
            && request.getState() != ConnectionRequestState.SEEN) {
          throw new BadRequestException(invalidStateMessage);
        }
        request.setState(state);
        connectionRequestService.update(request);

        if (state != ConnectionRequestState.IGNORED) {
          messagingService.sendToUser(
              request.getConnector(),
              Broker.ANSWERED_CONNECTION_REQUESTS,
              AnsweredConnectionRequestDTO.from(request));
        }
        break;
    }
  }
}
