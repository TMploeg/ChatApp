package com.tmploeg.chatapp.exceptions;

import org.springframework.http.HttpStatus;

public class ForbiddenException extends RestException {
  public ForbiddenException(String message) {
    super(message, HttpStatus.FORBIDDEN);
  }
}
