package com.tmploeg.chatapp.exceptions;

import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
public class RestException extends RuntimeException {
  private HttpStatus status;

  public RestException(String message, HttpStatus status) {
    super(message);
    this.status = status;
  }
}
