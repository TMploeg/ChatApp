package com.tmploeg.chatapp.security;

import com.tmploeg.chatapp.exceptions.UnauthorizedException;
import com.tmploeg.chatapp.users.User;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestAttributes;
import org.springframework.web.context.request.RequestContextHolder;

@Slf4j
@RequiredArgsConstructor
@Component
public class AuthenticationProvider {
  @Value("${app.request-auth-attr-name}")
  private String authAttributeName;

  public User getAuthenticatedUser() {
    RequestAttributes attributes = RequestContextHolder.getRequestAttributes();
    if (attributes == null) {
      log.debug("request attributes not found");
      return null;
    }

    Object authAttribute =
        attributes.getAttribute(authAttributeName, RequestAttributes.SCOPE_REQUEST);

    if (authAttribute == null) {
      throw new UnauthorizedException();
    }

    if (!(authAttribute instanceof User user)) {
      log.warn(
          "invalid authentication type: '{}', expected: '{}'",
          authAttribute.getClass().getSimpleName(),
          User.class.getSimpleName());

      throw new UnauthorizedException();
    }

    return user;
  }
}
