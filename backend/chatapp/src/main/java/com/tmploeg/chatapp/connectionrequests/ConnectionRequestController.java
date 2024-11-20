package com.tmploeg.chatapp.connectionrequests;

import com.tmploeg.chatapp.ApiRoutes;
import com.tmploeg.chatapp.connectionrequests.dtos.ConnectionRequestDTO;
import com.tmploeg.chatapp.connectionrequests.dtos.NewConnectionRequestDTO;
import com.tmploeg.chatapp.connectionrequests.dtos.ReceivedConnectionRequestDTO;
import com.tmploeg.chatapp.connectionrequests.dtos.UpdateConnectionRequestDTO;
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
  public List<ReceivedConnectionRequestDTO> getConnectionRequests(
      @RequestParam(name = "state", required = false) String[] states,
      @RequestParam(name = "direction", required = false) String direction) {
    User user = authenticationProvider.getAuthenticatedUser();

    ConnectionRequestDirection parsedDirection = parseDirection(direction);

    if (states == null || states.length == 0) {
      return connectionRequestService.getRequestsByUser(user, parsedDirection).stream()
          .map(ReceivedConnectionRequestDTO::from)
          .toList();
    }

    return connectionRequestService
        .getRequestsByUser(user, parseStates(states), parsedDirection)
        .stream()
        .map(ReceivedConnectionRequestDTO::from)
        .toList();
  }

  private ConnectionRequestDirection parseDirection(String direction) {
    return direction == null
        ? ConnectionRequestDirection.ALL
        : ConnectionRequestDirection.tryParse(direction)
            .orElseThrow(
                () ->
                    new BadRequestException(
                        "direction is invalid (invalid value: '" + direction + "')"));
  }

  private Collection<ConnectionRequestState> parseStates(String[] states) {
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
    User connector = authenticationProvider.getAuthenticatedUser();

    if (connectionRequestDTO.connecteeUsername() == null) {
      throw new BadRequestException("connecteeUsername is required");
    }
    if (connectionRequestDTO.connecteeUsername().isBlank()) {
      throw new BadRequestException("connecteeUsername can't be blank");
    }

    if (connector.getUsername().equals(connectionRequestDTO.connecteeUsername())) {
      throw new BadRequestException("can't send connection request to self");
    }

    User connectee =
        userService
            .findByUsername(connectionRequestDTO.connecteeUsername())
            .orElseThrow(
                () ->
                    new BadRequestException(
                        "user '" + connectionRequestDTO.connecteeUsername() + "' does not exist"));

    if (connectionRequestService.openRequestExists(connector, connectee)) {
      throw new BadRequestException("request to user already exists");
    }

    ConnectionRequest request = connectionRequestService.save(connector, connectee);

    messagingService.sendToUser(
        connectee,
        StompBroker.CONNECTION_REQUESTS,
        new ReceivedConnectionRequestDTO(
            request.getId(), request.getConnector().getUsername(), request.getState().toString()));
  }

  @PatchMapping("{id}")
  @ResponseStatus(HttpStatus.NO_CONTENT)
  @Transactional
  public void updateConnectionRequest(
      @RequestBody UpdateConnectionRequestDTO updateDTO, @PathVariable UUID id) {
    if (updateDTO.state() != null) {
      User user = authenticationProvider.getAuthenticatedUser();

      ConnectionRequest request =
          connectionRequestService.findByIdForUser(id, user).orElseThrow(NotFoundException::new);

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

    if (!newState.equals(ConnectionRequestState.IGNORED)) {
      messagingService.sendToUser(
          request.getConnector(),
          StompBroker.CONNECTION_REQUESTS,
          new ConnectionRequestDTO(request.getConnectee().getUsername(), newState));
    }
  }
}
