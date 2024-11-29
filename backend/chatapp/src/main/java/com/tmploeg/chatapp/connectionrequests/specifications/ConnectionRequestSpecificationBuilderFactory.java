package com.tmploeg.chatapp.connectionrequests.specifications;

import com.tmploeg.chatapp.security.AuthenticationProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class ConnectionRequestSpecificationBuilderFactory {
  private final AuthenticationProvider authenticationProvider;

  public ConnectionRequestSpecificationBuilder get() {
    return new ConnectionRequestSpecificationBuilder(authenticationProvider);
  }
}
