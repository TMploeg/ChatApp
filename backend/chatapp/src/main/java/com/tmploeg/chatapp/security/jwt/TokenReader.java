package com.tmploeg.chatapp.security.jwt;

import com.tmploeg.chatapp.users.User;
import java.util.Optional;

public interface TokenReader {
  Optional<User> readToken(String token);
}
