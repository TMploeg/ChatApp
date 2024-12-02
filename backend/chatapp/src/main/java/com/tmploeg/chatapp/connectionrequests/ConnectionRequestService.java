package com.tmploeg.chatapp.connectionrequests;

import com.tmploeg.chatapp.connectionrequests.specifications.ConnectionRequestSpecificationBuilder;
import com.tmploeg.chatapp.connectionrequests.specifications.ConnectionRequestSpecificationBuilderFactory;
import com.tmploeg.chatapp.connectionrequests.specifications.ConnectionRequestSpecificationConfigurer;
import com.tmploeg.chatapp.users.User;
import java.time.LocalDateTime;
import java.util.*;
import java.util.function.Consumer;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
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

  @Value("${app.connection-request-resend-delay.hrs}")
  private int resendDelayHrs;

  public ConnectionRequest save(User connector, User connectee) {
    return connectionRequestRepository.save(
        new ConnectionRequest(connector, connectee, LocalDateTime.now()));
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

  public Optional<ConnectionRequest> getByIdIfUserIsConnectee(UUID id, User user) {
    return findOne(
        (configurer) -> {
          configurer.hasId(id);
          configurer.hasUser(user, ConnectionRequestDirection.TWO_WAY);
        });
  }

  public boolean recentRequestToConnecteeExists(User connector, User connectee) {
    return exists(
        (configurer) -> {
          configurer.hasUser(connector, ConnectionRequestDirection.OUTGOING);
          configurer.hasUser(connectee, ConnectionRequestDirection.INCOMING);
          configurer.sendAfter(LocalDateTime.now().minusHours(resendDelayHrs));
        });
  }

  public void update(ConnectionRequest request) {
    connectionRequestRepository.save(request);
  }
}
