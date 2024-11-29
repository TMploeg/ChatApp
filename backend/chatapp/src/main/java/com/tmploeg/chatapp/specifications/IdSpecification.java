package com.tmploeg.chatapp.specifications;

import org.springframework.data.jpa.domain.Specification;
import org.springframework.lang.NonNull;

public class IdSpecification<TEntity> extends PropertySpecification<TEntity> {
  private static final String ID_PROPERTY_NAME = "id";

  public IdSpecification(Object id) {
    super(id, ID_PROPERTY_NAME);
  }

  @Override
  @NonNull
  public Specification<TEntity> and(Specification<TEntity> other) {
    return super.and(other);
  }

  @Override
  @NonNull
  public Specification<TEntity> or(Specification<TEntity> other) {
    return super.or(other);
  }
}
