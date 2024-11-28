package com.tmploeg.chatapp.connectionrequests;

import com.tmploeg.chatapp.users.User;
import java.util.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ConnectionRequestService {
  private final ConnectionRequestRepository connectionRequestRepository;

  public ConnectionRequest save(User connector, User connectee) {
    return connectionRequestRepository.save(new ConnectionRequest(connector, connectee));
  }

  public List<ConnectionRequest> filterAll(
      Specification<ConnectionRequest> specification) {
    if (specification == null) {
      throw new IllegalArgumentException("specification is null");
    }

    return connectionRequestRepository.findAll(specification);
  }

  public Optional<ConnectionRequest> filterById(
      UUID id, Specification<ConnectionRequest> specification) {
    if (specification == null) {
      throw new IllegalArgumentException("specification is null");
    }

    return connectionRequestRepository.findOne(
        specification.and(ConnectionRequestSpecificationFactory.hasId(id)));
  }

  public boolean exists(Specification<ConnectionRequest> specification) {
    if (specification == null) {
      throw new IllegalArgumentException("specification is null");
    }

    return connectionRequestRepository.exists(specification);
  }
}
