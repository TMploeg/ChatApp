package com.tmploeg.chatapp.specifications;

import jakarta.persistence.criteria.*;
import java.util.Collection;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.lang.NonNull;

public class PropertySpecification<TEntity> implements Specification<TEntity> {
  private final Object value;
  private final String[] propertyPath;

  public PropertySpecification(Object value, String... propertyPath) {
    if (value == null) {
      throw new IllegalArgumentException("value is null");
    }
    if (propertyPath == null || propertyPath.length == 0) {
      throw new IllegalArgumentException("propertyPath must have at least one element");
    }

    this.value = value;
    this.propertyPath = propertyPath;
  }

  @Override
  public Predicate toPredicate(
      @NonNull Root<TEntity> root, CriteriaQuery<?> query, @NonNull CriteriaBuilder builder) {
    Path<?> path = root.get(propertyPath[0]);
    for (int i = 1; i < propertyPath.length; i++) {
      path = path.get(propertyPath[i]);
    }

    if (value instanceof Collection<?> collectionValue) {
      return path.in(collectionValue);
    }

    return builder.equal(path, value);
  }

  @Override
  @NonNull
  public Specification<TEntity> and(Specification<TEntity> other) {
    return Specification.super.and(other);
  }

  @Override
  @NonNull
  public Specification<TEntity> or(Specification<TEntity> other) {
    return Specification.super.or(other);
  }
}
