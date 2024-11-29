package com.tmploeg.chatapp.dtos.page;

import java.util.Collection;
import java.util.function.Function;
import org.springframework.data.domain.Page;

public record PageDTO<TData>(Collection<TData> page, PageMetaDTO meta) {
  public static <TInput, TResult> PageDTO<TResult> from(
      Page<TInput> page, Function<TInput, TResult> resultSelector) {
    return new PageDTO<>(
        page.stream().map(resultSelector).toList(),
        new PageMetaDTO(page.getNumber(), page.getSize(), page.getTotalPages()));
  }
}
