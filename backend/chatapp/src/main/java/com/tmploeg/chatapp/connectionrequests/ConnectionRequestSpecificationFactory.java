package com.tmploeg.chatapp.connectionrequests;

import com.tmploeg.chatapp.users.User;
import jakarta.persistence.criteria.*;
import java.util.Arrays;
import java.util.Collection;
import java.util.UUID;
import org.springframework.data.jpa.domain.Specification;

public class ConnectionRequestSpecificationFactory {

  public static Specification<ConnectionRequest> hasId(UUID id) {
    return (root, query, builder) -> builder.equal(root.get("id"), id);
  }

  public static Specification<ConnectionRequest> hasUser(
      User user, ConnectionRequestDirection direction) {
    return (root, query, builder) -> {
      Predicate connectorPredicate = builder.equal(root.get("connector"), user);
      Predicate connecteePredicate = builder.equal(root.get("connectee"), user);

      return switch (direction) {
        case INCOMING -> connecteePredicate;
        case OUTGOING -> connectorPredicate;
        case TWO_WAY -> builder.or(connecteePredicate, connectorPredicate);
      };
    };
  }

  public static Specification<ConnectionRequest> inState(ConnectionRequestState... states) {
    return inState(Arrays.stream(states).toList());
  }

  public static Specification<ConnectionRequest> inState(
      Collection<ConnectionRequestState> states) {
    return (root, query, builder) -> root.get("state").in(states);
  }

  public static Specification<ConnectionRequest> orderedByOppositeUserAsc(
      Specification<ConnectionRequest> specification, User user) {
    return orderedByOppositeUser(specification, user, true);
  }

  public static Specification<ConnectionRequest> orderedByOppositeUserDesc(
      Specification<ConnectionRequest> specification, User user) {
    return orderedByOppositeUser(specification, user, false);
  }

  private static Specification<ConnectionRequest> orderedByOppositeUser(
      Specification<ConnectionRequest> specification, User user, boolean asc) {
    return (root, query, builder) -> {
      Expression<?> expression =
          builder
              .selectCase()
              .when(
                  builder.equal(root.get("connector"), user), root.get("connectee").get("username"))
              .otherwise(root.get("connector").get("username"));

      assert query != null;
      CriteriaQuery<?> orderedQuery =
          query.orderBy(asc ? builder.asc(expression) : builder.desc(expression));

      return specification.toPredicate(root, orderedQuery, builder);
    };
  }
}
