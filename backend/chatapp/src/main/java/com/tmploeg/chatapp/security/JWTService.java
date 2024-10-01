package com.tmploeg.chatapp.security;

import com.tmploeg.chatapp.users.User;
import com.tmploeg.chatapp.users.UserRepository;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import java.util.Date;
import java.util.Map;
import java.util.Optional;
import javax.crypto.SecretKey;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class JWTService {
  @Value("${app.jwt.expiration-hours}")
  private int expirationHours;

  private static final long MILLIS_PER_HOUR = 3600000;
  private static final Logger LOGGER = LoggerFactory.getLogger(JWTService.class);

  private final SecretKey secretKey;
  private final UserRepository userRepository;

  public String createToken(User user) {
    Date now = new Date();
    Date expiration = new Date(now.getTime() + expirationHours * MILLIS_PER_HOUR);

    return Jwts.builder()
        .claims(Map.of())
        .subject(user.getUsername())
        .issuedAt(now)
        .expiration(expiration)
        .signWith(secretKey)
        .compact();
  }

  public Optional<BearerToken> readToken(String token) {
    if (token == null) {
      throw new IllegalArgumentException("token is null");
    }

    try {
      Claims claims =
          Jwts.parser().verifyWith(secretKey).build().parseSignedClaims(token).getPayload();

      User user =
          userRepository
              .findById(claims.getSubject())
              .orElseThrow(() -> new JwtException("subject not found"));

      TokenState state =
          !claims.getExpiration().after(new Date()) ? TokenState.EXPIRED : TokenState.VALID;

      return Optional.of(new BearerToken(user, state));
    } catch (JwtException ex) {
      LOGGER.atWarn().log("Failed to read bearer token: " + ex.getMessage() + "'");

      return Optional.empty();
    }
  }
}
