package com.tmploeg.chatapp.exceptions;

import org.springframework.http.HttpStatus;

public class BadRequestException extends RestException {
  public BadRequestException(String message) {
    super(message, HttpStatus.BAD_REQUEST);
  }
}
