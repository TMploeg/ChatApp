package com.tmploeg.chatapp.connectionrequests;

import com.tmploeg.chatapp.ApiRoutes;
import com.tmploeg.chatapp.connectionrequests.dtos.ConnectionRequestDTO;
import com.tmploeg.chatapp.connectionrequests.dtos.NewConnectionRequestDTO;
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
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
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
  public List<ConnectionRequestDTO> getConnectionRequests(
      @RequestParam(name = "state", defaultValue = "") String[] states,
      @RequestParam(name = "direction", required = false) String direction) {
    ConnectionRequestDirection parsedDirection = parseDirection(direction);
    List<ConnectionRequestState> parsedStates = parseStates(states);
    User user = authenticationProvider.getAuthenticatedUser();

    Specification<ConnectionRequest> specification =
        switch (parsedDirection) {
          case INCOMING ->
              requestSpecification(user, ConnectionRequestDirection.INCOMING, parsedStates);
          case OUTGOING ->
              maskedRequestSpecification(user, ConnectionRequestDirection.OUTGOING, parsedStates);
          case TWO_WAY ->
              Specification.anyOf(
                  requestSpecification(user, ConnectionRequestDirection.INCOMING, parsedStates),
                  maskedRequestSpecification(
                      user, ConnectionRequestDirection.OUTGOING, parsedStates));
        };

    return connectionRequestService
        .filterAll(
            ConnectionRequestSpecificationFactory.orderedByOppositeUserAsc(specification, user))
        .stream()
        .map(request -> ConnectionRequestDTO.from(request, user))
        .toList();
  }

  private Specification<ConnectionRequest> requestSpecification(
      User user, ConnectionRequestDirection direction, Collection<ConnectionRequestState> states) {
    List<Specification<ConnectionRequest>> specifications = new ArrayList<>();

    specifications.add(ConnectionRequestSpecificationFactory.hasUser(user, direction));

    if (!states.isEmpty()) {
      specifications.add(ConnectionRequestSpecificationFactory.inState(states));
    }

    return Specification.allOf(specifications);
  }

  private Specification<ConnectionRequest> maskedRequestSpecification(
      User user, ConnectionRequestDirection direction, Collection<ConnectionRequestState> states) {
    return requestSpecification(user, direction, maskIgnored(states));
  }

  private Sort getSort(ConnectionRequestDirection direction) {
    String connectorUsernameProperty = "connector.username";
    String connecteeUsernameProperty = "connectee.username";

    return switch (direction) {
      case INCOMING -> Sort.by(Sort.Order.asc(connectorUsernameProperty));
      case OUTGOING -> Sort.by(Sort.Order.asc(connecteeUsernameProperty));
      case TWO_WAY ->
          Sort.by(
              Sort.Order.asc(connectorUsernameProperty), Sort.Order.asc(connecteeUsernameProperty));
    };
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

  private List<ConnectionRequestState> maskIgnored(Collection<ConnectionRequestState> states) {
    List<ConnectionRequestState> newStates = new ArrayList<>(states);
    if (newStates.contains(ConnectionRequestState.SEEN)) {
      if (!newStates.contains(ConnectionRequestState.IGNORED)) {
        newStates.add(ConnectionRequestState.IGNORED);
      }
    } else {
      newStates.remove(ConnectionRequestState.IGNORED);
    }

    return newStates;
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

    // TODO enable users to resend requests after time has passed
    Specification<ConnectionRequest> connectorSpecification =
        ConnectionRequestSpecificationFactory.hasUser(
            connector, ConnectionRequestDirection.OUTGOING);
    Specification<ConnectionRequest> connecteeSpecification =
        ConnectionRequestSpecificationFactory.hasUser(
            connectee, ConnectionRequestDirection.INCOMING);

    if (connectionRequestService.exists(connectorSpecification.and(connecteeSpecification))) {
      throw new BadRequestException("request to user already exists");
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
              .filterById(
                  id,
                  ConnectionRequestSpecificationFactory.hasUser(
                      user, ConnectionRequestDirection.TWO_WAY))
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
