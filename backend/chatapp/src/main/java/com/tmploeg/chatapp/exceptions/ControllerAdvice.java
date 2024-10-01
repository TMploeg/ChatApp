package com.tmploeg.chatapp.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.http.ProblemDetail;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class ControllerAdvice {
  @ExceptionHandler(RestException.class)
  public ResponseEntity<ProblemDetail> handleRestException(RestException exception) {
    HttpStatus status = exception.getStatus();
    return ResponseEntity.status(status)
        .body(ProblemDetail.forStatusAndDetail(status, exception.getMessage()));
  }
}
