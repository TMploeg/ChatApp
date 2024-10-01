package com.tmploeg.chatapp.security;

import com.tmploeg.chatapp.users.User;

public record BearerToken(User user, TokenState state) {
  public boolean isInvalid() {
    return state == TokenState.EXPIRED;
  }
}
