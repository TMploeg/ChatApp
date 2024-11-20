package com.tmploeg.chatapp.connectionrequests;

import com.tmploeg.chatapp.users.User;
import java.util.Collection;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ConnectionRequestService {
  private final ConnectionRequestRepository connectionRequestRepository;

  public Set<ConnectionRequest> getRequestsByUser(User user, ConnectionRequestDirection direction) {
    return switch (direction) {
      case ALL -> connectionRequestRepository.findByUsername(user.getUsername());
      case SEND -> connectionRequestRepository.findByConnectorUsername(user.getUsername());
      case RECEIVED -> connectionRequestRepository.findByConnecteeUsername(user.getUsername());
    };
  }

  public Set<ConnectionRequest> getRequestsByUser(
      User user, Collection<ConnectionRequestState> states, ConnectionRequestDirection direction) {
    return switch (direction) {
      case ALL -> connectionRequestRepository.findByUsernameAndStates(user.getUsername(), states);
      case SEND ->
          connectionRequestRepository.findByConnectorUsernameAndStates(user.getUsername(), states);
      case RECEIVED ->
          connectionRequestRepository.findByConnecteeUsernameAndStates(user.getUsername(), states);
    };
  }

  public ConnectionRequest save(User connector, User connectee) {
    return connectionRequestRepository.save(new ConnectionRequest(connector, connectee));
  }

  public boolean openRequestExists(User connector, User connectee) {
    return connectionRequestRepository.connectionRequestExists(
        connector.getUsername(), connectee.getUsername());
  }

  public Optional<ConnectionRequest> findByIdForUser(UUID id, User user) {
    return connectionRequestRepository.getRequestByIdForUser(id, user.getUsername());
  }
}
