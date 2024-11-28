package com.tmploeg.chatapp.connections;

import com.tmploeg.chatapp.connectionrequests.ConnectionRequestDirection;
import com.tmploeg.chatapp.connectionrequests.ConnectionRequestService;
import com.tmploeg.chatapp.connectionrequests.ConnectionRequestSpecificationFactory;
import com.tmploeg.chatapp.connectionrequests.ConnectionRequestState;
import com.tmploeg.chatapp.users.User;
import java.util.Set;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ConnectionService {
  private final ConnectionRequestService connectionRequestService;

  public Set<User> getConnectedUsers(User user) {
    return connectionRequestService
        .filterAll(
            Specification.allOf(
                ConnectionRequestSpecificationFactory.hasUser(
                    user, ConnectionRequestDirection.TWO_WAY),
                ConnectionRequestSpecificationFactory.inState(ConnectionRequestState.ACCEPTED)))
        .stream()
        .map(
            request ->
                request.getConnector().getUsername().equals(user.getUsername())
                    ? request.getConnectee()
                    : request.getConnector())
        .collect(Collectors.toSet());
  }
}
