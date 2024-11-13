package com.tmploeg.chatapp.exceptions;

import org.springframework.http.HttpStatus;

public class NotFoundException extends RestException {
  public NotFoundException() {
    super("not found", HttpStatus.NOT_FOUND);
  }
}
