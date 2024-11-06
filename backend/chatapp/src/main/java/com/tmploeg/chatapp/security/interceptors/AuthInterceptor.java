package com.tmploeg.chatapp.security.interceptors;

import com.tmploeg.chatapp.security.jwt.TokenReader;
import com.tmploeg.chatapp.users.User;
import java.util.Optional;

public abstract class AuthInterceptor {
  protected Optional<User> getUserFromAuthorization(String authorization, TokenReader tokenReader) {
    if (authorization == null || !authorization.contains(" ")) {
      return Optional.empty();
    }

    return tokenReader.readToken(authorization.split(" ")[1]);
  }
}
