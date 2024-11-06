package com.tmploeg.chatapp.security.jwt;

import com.tmploeg.chatapp.users.User;

public interface TokenWriter {
  String writeToken(User user);
}
