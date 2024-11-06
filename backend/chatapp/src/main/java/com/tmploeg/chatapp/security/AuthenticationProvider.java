package com.tmploeg.chatapp.security;

import com.tmploeg.chatapp.exceptions.UnauthorizedException;
import com.tmploeg.chatapp.users.User;
import com.tmploeg.chatapp.users.UserService;
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

  private final UserService userService;

  public User getAuthenticatedUser() {
    RequestAttributes attributes = RequestContextHolder.getRequestAttributes();
    if (attributes == null) {
      log.debug("request attributes not found");
      return null;
    }

    Object authAttribute =
        attributes.getAttribute(authAttributeName, RequestAttributes.SCOPE_REQUEST);

    if (!(authAttribute instanceof Authentication auth)) {
      log.warn("attempted to retrieve authentication when user is not authenticated");
      throw new UnauthorizedException();
    }

    return userService.findByUsername(auth.getUsername()).orElseThrow(UnauthorizedException::new);
  }
}
