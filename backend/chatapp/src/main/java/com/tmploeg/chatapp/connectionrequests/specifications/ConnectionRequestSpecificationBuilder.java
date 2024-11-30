package com.tmploeg.chatapp.connectionrequests.specifications;

import com.tmploeg.chatapp.connectionrequests.ConnectionRequest;
import com.tmploeg.chatapp.connectionrequests.ConnectionRequestDirection;
import com.tmploeg.chatapp.connectionrequests.ConnectionRequestState;
import com.tmploeg.chatapp.exceptions.BadRequestException;
import com.tmploeg.chatapp.security.AuthenticationProvider;
import com.tmploeg.chatapp.specifications.IdSpecification;
import com.tmploeg.chatapp.specifications.PropertySpecification;
import com.tmploeg.chatapp.users.User;
import jakarta.persistence.criteria.*;
import java.util.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;

@RequiredArgsConstructor
public class ConnectionRequestSpecificationBuilder
    implements ConnectionRequestSpecificationConfigurer {
  private final AuthenticationProvider authenticationProvider;
  private final List<Specification<ConnectionRequest>> specifications = new ArrayList<>();

  private Sort sort;

  public Specification<ConnectionRequest> build() {
    Specification<ConnectionRequest> fullSpecification = Specification.allOf(specifications);

    if (sort != null) {
      return getSortedSpecification(fullSpecification);
    }

    return fullSpecification;
  }

  @Override
  public void hasId(UUID id) {
    specifications.add(new IdSpecification<>(id));
  }

  @Override
  public void hasUser(User user, ConnectionRequestDirection direction) {
    specifications.add(getUserSpecification(user, direction));
  }

  private Specification<ConnectionRequest> getUserSpecification(
      User user, ConnectionRequestDirection direction) {
    return switch (direction) {
      case INCOMING -> connecteeSpecification(user);
      case OUTGOING -> connectorSpecification(user);
      case TWO_WAY ->
          Specification.anyOf(connecteeSpecification(user), connectorSpecification(user));
    };
  }

  private static Specification<ConnectionRequest> connectorSpecification(User user) {
    return new PropertySpecification<>(user.getUsername(), "connector", "username");
  }

  private static Specification<ConnectionRequest> connecteeSpecification(User user) {
    return new PropertySpecification<>(user.getUsername(), "connectee", "username");
  }

  @Override
  public void inState(ConnectionRequestState state) {
    specifications.add(new PropertySpecification<>(state, "state"));
  }

  @Override
  public void inState(Collection<ConnectionRequestState> states) {
    if (states.isEmpty()) {
      return;
    }

    specifications.add(new PropertySpecification<>(states, "state"));
  }

  public void sorted(Sort sort) {
    this.sort = sort;
  }

  private Specification<ConnectionRequest> getSortedSpecification(
      Specification<ConnectionRequest> unpagedSpecification) {
    return (root, query, builder) -> {
      assert query != null;

      if (sort.get().findAny().isEmpty()) {
        return unpagedSpecification.toPredicate(root, query, builder);
      }

      CriteriaQuery<?> sortedQuery =
          query.orderBy(
              sort.get()
                  .map(
                      order -> {
                        Expression<?> expression =
                            getExpressionForProperty(order.getProperty(), builder, root);

                        return order.isAscending()
                            ? builder.asc(expression)
                            : builder.desc(expression);
                      })
                  .toList());

      return unpagedSpecification.toPredicate(root, sortedQuery, builder);
    };
  }

  private Expression<?> getExpressionForProperty(
      String property, CriteriaBuilder builder, Root<ConnectionRequest> root) {
    return switch (property) {
      case "id" -> root.get("id");
      case "subject" ->
          builder
              .selectCase()
              .when(
                  builder.equal(
                      root.get("connector").get("username"),
                      authenticationProvider.getAuthenticatedUser().getUsername()),
                  root.get("connectee").get("username"))
              .otherwise(root.get("connector").get("username"));
      case "state" -> root.get("state");
      default -> throw new BadRequestException("invalid sort property '" + property + "'");
    };
  }
}
