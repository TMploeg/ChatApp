package com.tmploeg.chatapp.connectionrequests;

import com.tmploeg.chatapp.ApiRoutes;
import com.tmploeg.chatapp.connectionrequests.dtos.ConnectionRequestDTO;
import com.tmploeg.chatapp.connectionrequests.dtos.NewConnectionRequestDTO;
import com.tmploeg.chatapp.connectionrequests.dtos.UpdateConnectionRequestDTO;
import com.tmploeg.chatapp.dtos.page.PageDTO;
import com.tmploeg.chatapp.exceptions.BadRequestException;
import com.tmploeg.chatapp.exceptions.ForbiddenException;
import com.tmploeg.chatapp.exceptions.NotFoundException;
import com.tmploeg.chatapp.messaging.MessagingService;
import com.tmploeg.chatapp.messaging.StompBroker;
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
  public PageDTO<ConnectionRequestDTO> getConnectionRequests(
      @RequestParam(name = "state", defaultValue = "") String[] states,
      @RequestParam(name = "direction", required = false) String direction,
      Pageable pageable) {
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
              specificationConfigurer.hasUser(user, parseDirection(direction));
              specificationConfigurer.inState(parseStates(states));
            }),
            pageable);

    return PageDTO.from(requests, (request) -> ConnectionRequestDTO.from(request, user));
  }

  private ConnectionRequestDirection parseDirection(String direction) {
    return direction == null
        ? ConnectionRequestDirection.TWO_WAY
        : ConnectionRequestDirection.tryParse(direction)
            .orElseThrow(
                () ->
                    new BadRequestException(
                        "direction is invalid (invalid value: '" + direction + "')"));
  }

  private List<ConnectionRequestState> parseStates(String[] states) {
    List<ConnectionRequestState> targetStates = new ArrayList<>(states.length);

    for (String state : states) {
      targetStates.add(
          ConnectionRequestState.tryParse(state)
              .orElseThrow(
                  () ->
                      new BadRequestException(
                          "state contains invalid value (invalid value: '" + state + "')")));
    }

    return targetStates;
  }

  @PostMapping
  @ResponseStatus(HttpStatus.CREATED)
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

    // TODO enable users to resend requests after time has passed
    if (connectionRequestService.existsForConnectorAndConnectee(connector, connectee)) {
      throw new BadRequestException("request to subject already exists");
    }

    ConnectionRequest request = connectionRequestService.save(connector, connectee);

    messagingService.sendToUser(
        connectee, StompBroker.CONNECTION_REQUESTS, ConnectionRequestDTO.from(request, connector));
  }

  @PatchMapping("{id}")
  @ResponseStatus(HttpStatus.NO_CONTENT)
  @Transactional
  public void updateConnectionRequest(
      @RequestBody UpdateConnectionRequestDTO updateDTO, @PathVariable UUID id) {
    if (updateDTO.state() != null) {
      User user = authenticationProvider.getAuthenticatedUser();

      ConnectionRequest request =
          connectionRequestService
              .findOne(
                  (configurer) -> {
                    configurer.hasId(id);
                    configurer.hasUser(user, ConnectionRequestDirection.TWO_WAY);
                  })
              .orElseThrow(NotFoundException::new);

      ConnectionRequestState newState =
          ConnectionRequestState.tryParse(updateDTO.state())
              .orElseThrow(() -> new BadRequestException(getInvalidStateMessage()));

      updateState(user, request, newState);
    }
  }

  private String getInvalidStateMessage() {
    return "state is invalid (valid values: ["
        + String.join(
            ", ",
            Arrays.stream(ConnectionRequestState.values())
                .map(state -> state.name().toLowerCase())
                .toList())
        + "]";
  }

  private void updateState(User user, ConnectionRequest request, ConnectionRequestState newState) {
    if (request.getConnector().getUsername().equals(user.getUsername())) {
      throw new ForbiddenException(
          "state is illegal, only state of received requests can be modified");
    }

    if (newState.equals(request.getState())) {
      return;
    }

    switch (request.getState()) {
      case IGNORED, ACCEPTED, REJECTED:
        throw new ForbiddenException(
            "state is illegal: can't update when request is '"
                + request.getState().name().toLowerCase()
                + "'");
      case SEEN:
        if (newState.equals(ConnectionRequestState.SEND)) {
          throw new BadRequestException("state is invalid: can't unsee request");
        }
        break;
      default:
        break;
    }

    request.setState(newState);

    if (newState.equals(ConnectionRequestState.ACCEPTED)
        || newState.equals(ConnectionRequestState.REJECTED)) {
      messagingService.sendToUser(
          request.getConnector(),
          StompBroker.CONNECTION_REQUESTS,
          ConnectionRequestDTO.from(request, user));
    }
  }
}
