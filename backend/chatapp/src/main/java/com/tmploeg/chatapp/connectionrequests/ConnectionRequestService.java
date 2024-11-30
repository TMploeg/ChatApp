package com.tmploeg.chatapp.connectionrequests;

import com.tmploeg.chatapp.connectionrequests.specifications.ConnectionRequestSpecificationBuilder;
import com.tmploeg.chatapp.connectionrequests.specifications.ConnectionRequestSpecificationBuilderFactory;
import com.tmploeg.chatapp.connectionrequests.specifications.ConnectionRequestSpecificationConfigurer;
import com.tmploeg.chatapp.users.User;
import java.util.*;
import java.util.function.Consumer;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ConnectionRequestService {
  private final ConnectionRequestRepository connectionRequestRepository;
  private final ConnectionRequestSpecificationBuilderFactory specificationBuilderFactory;

  public ConnectionRequest save(User connector, User connectee) {
    return connectionRequestRepository.save(new ConnectionRequest(connector, connectee));
  }

  public List<ConnectionRequest> findAll(
      Consumer<ConnectionRequestSpecificationConfigurer> configureSpecification) {
    if (configureSpecification == null) {
      throw new IllegalArgumentException("configureSpecification is null");
    }

    ConnectionRequestSpecificationBuilder specificationBuilder = specificationBuilderFactory.get();

    configureSpecification.accept(specificationBuilder);

    return connectionRequestRepository.findAll(specificationBuilder.build());
  }

  public Page<ConnectionRequest> findAll(
      Consumer<ConnectionRequestSpecificationConfigurer> configureSpecification,
      Pageable pageable) {
    if (configureSpecification == null) {
      throw new IllegalArgumentException("configureSpecification is null");
    }

    ConnectionRequestSpecificationBuilder specificationBuilder = specificationBuilderFactory.get();

    configureSpecification.accept(specificationBuilder);
    specificationBuilder.sorted(pageable.getSort());

    Specification<ConnectionRequest> specification = specificationBuilder.build();

    if (pageable.isUnpaged()) {
      return connectionRequestRepository.findAll(specification, pageable);
    }

    return connectionRequestRepository.findAll(
        specification, PageRequest.of(pageable.getPageNumber(), pageable.getPageSize()));
  }

  public Optional<ConnectionRequest> findOne(
      Consumer<ConnectionRequestSpecificationConfigurer> configureSpecification) {
    if (configureSpecification == null) {
      throw new IllegalArgumentException("configureSpecification is null");
    }

    ConnectionRequestSpecificationBuilder specificationBuilder = specificationBuilderFactory.get();

    configureSpecification.accept(specificationBuilder);

    return connectionRequestRepository.findOne(specificationBuilder.build());
  }

  public boolean exists(Consumer<ConnectionRequestSpecificationConfigurer> configureSpecification) {
    if (configureSpecification == null) {
      throw new IllegalArgumentException("configureSpecification is null");
    }

    ConnectionRequestSpecificationBuilder specificationBuilder = specificationBuilderFactory.get();

    configureSpecification.accept(specificationBuilder);

    return connectionRequestRepository.exists(specificationBuilder.build());
  }

  public boolean existsForConnectorAndConnectee(User connector, User connectee) {
    return exists(
        (configurer) -> {
          configurer.hasUser(connector, ConnectionRequestDirection.OUTGOING);
          configurer.hasUser(connectee, ConnectionRequestDirection.INCOMING);
        });
  }

  //  private Specification<ConnectionRequest> requestSpecification(
  //      User user, ConnectionRequestDirection direction, Collection<ConnectionRequestState>
  // states) {
  //    List<Specification<ConnectionRequest>> specifications = new ArrayList<>();
  //
  //    specifications.add(ConnectionRequestSpecificationBuilder.hasUser(user, direction));
  //
  //    if (!states.isEmpty()) {
  //      specifications.add(ConnectionRequestSpecificationBuilder.inState(states));
  //    }
  //
  //    return Specification.allOf(specifications);
  //  }
  //
  //  private Specification<ConnectionRequest> maskedRequestSpecification(
  //      User user, ConnectionRequestDirection direction, Collection<ConnectionRequestState>
  // states) {
  //    return requestSpecification(user, direction, maskIgnored(states));
  //  }
  //
  //  private List<ConnectionRequestState> maskIgnored(Collection<ConnectionRequestState> states) {
  //    List<ConnectionRequestState> newStates = new ArrayList<>(states);
  //    if (newStates.contains(ConnectionRequestState.SEEN)) {
  //      if (!newStates.contains(ConnectionRequestState.IGNORED)) {
  //        newStates.add(ConnectionRequestState.IGNORED);
  //      }
  //    } else {
  //      newStates.remove(ConnectionRequestState.IGNORED);
  //    }
  //
  //    return newStates;
  //  }

  //    Specification<ConnectionRequest> specification =
  //        switch (direction) {
  //          case INCOMING -> requestSpecification(user, ConnectionRequestDirection.INCOMING,
  // states);
  //          case OUTGOING ->
  //              maskedRequestSpecification(user, ConnectionRequestDirection.OUTGOING, states);
  //          case TWO_WAY ->
  //              Specification.anyOf(
  //                  requestSpecification(user, ConnectionRequestDirection.INCOMING, states),
  //                  maskedRequestSpecification(user, ConnectionRequestDirection.OUTGOING,
  // states));
  //        };
  //
  //    specification = ConnectionRequestSpecificationBuilder.ordered(specification, pageable,
  // user);
}
