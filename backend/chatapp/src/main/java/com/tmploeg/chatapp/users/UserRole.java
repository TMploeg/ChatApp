package com.tmploeg.chatapp.users;

public enum UserRole {
  USER;

  private static final String ROLE_PREFIX = "ROLE_";

  @Override
  public String toString() {
    return ROLE_PREFIX + name();
  }
}
