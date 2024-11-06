package com.tmploeg.chatapp.exceptions;

import org.springframework.http.HttpStatus;

public class UnauthorizedException extends RestException {
  public UnauthorizedException() {
    super("unauthorized", HttpStatus.UNAUTHORIZED);
  }
}
