package com.tmploeg.chatapp.connections;

import com.tmploeg.chatapp.connectionrequests.*;
import com.tmploeg.chatapp.users.User;
import java.util.Set;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ConnectionService {
  private final ConnectionRequestService connectionRequestService;

  // TODO pagination?
  public Set<User> getConnectedUsers(User user) {
    return connectionRequestService
        .findAll(
            (specificationConfigurer) -> {
              specificationConfigurer.hasUser(user, ConnectionRequestDirection.TWO_WAY);
              specificationConfigurer.inState(ConnectionRequestState.ACCEPTED);
            })
        .stream()
        .map(
            request ->
                request.getConnector().getUsername().equals(user.getUsername())
                    ? request.getConnectee()
                    : request.getConnector())
        .collect(Collectors.toSet());
  }
}
