package com.tmploeg.chatapp.security.interceptors;

import com.tmploeg.chatapp.security.Authentication;
import com.tmploeg.chatapp.security.Public;
import com.tmploeg.chatapp.security.jwt.JWTService;
import com.tmploeg.chatapp.users.User;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.lang.reflect.Method;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.method.HandlerMethod;
import org.springframework.web.servlet.HandlerInterceptor;

@Component
@RequiredArgsConstructor
@Slf4j
public class AuthHandlerInterceptor extends AuthInterceptor implements HandlerInterceptor {
  @Value("${app.request-auth-attr-name}")
  private String authAttributeName;

  private final JWTService jwtService;

  @Override
  public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler)
      throws Exception {
    if (!(handler instanceof HandlerMethod handlerMethod)) {
      log.warn(
          "failed to handle request, handler not of type 'HandlerMethod' (handler: '{}')",
          handler.getClass().getName());
      return true;
    }

    if (isPublic(handlerMethod.getMethod())) {
      return true;
    }

    String authorization = request.getHeader(HttpHeaders.AUTHORIZATION);
    Optional<User> user = getUserFromAuthorization(authorization, jwtService);

    if (user.isEmpty()) {
      response.sendError(HttpStatus.UNAUTHORIZED.value());
      log.info("blocked unauthorized request");
      return false;
    }

    Authentication auth = () -> user.get().getUsername();
    request.setAttribute(authAttributeName, auth);

    return true;
  }

  private boolean isPublic(Method handler) {
    return handler.isAnnotationPresent(Public.class)
        || handler.getDeclaringClass().isAnnotationPresent(Public.class);
  }
}
