package com.tmploeg.chatapp.connectionrequests;

import com.tmploeg.chatapp.users.User;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ConnectionRequestService {
  private final ConnectionRequestRepository connectionRequestRepository;

  public Set<ConnectionRequest> getRequestsByUser(User user) {
    return connectionRequestRepository.findByConnectee_username(user.getUsername());
  }

  public Set<ConnectionRequest> getRequestsByUserAndState(User user, ConnectionRequestState state) {
    return connectionRequestRepository.findByConnectee_usernameAndState(user.getUsername(), state);
  }

  public void save(User connector, User connectee) {
    connectionRequestRepository.save(new ConnectionRequest(connector, connectee));
  }

  public boolean openRequestExists(User connector, User connectee) {
    return connectionRequestRepository.connectionRequestExists(
        connector.getUsername(), connectee.getUsername());
  }

  public Optional<ConnectionRequest> findByIdForUser(UUID id, User user) {
    return connectionRequestRepository.getRequestByIdForUser(id, user.getUsername());
  }
}
