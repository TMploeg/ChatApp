package com.tmploeg.chatapp.security.jwt;

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
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class JWTService implements TokenWriter, TokenReader {
  @Value("${app.jwt.expiration-hours}")
  private int expirationHours;

  private static final long MILLIS_PER_HOUR = 3600000;

  private final SecretKey secretKey;
  private final UserRepository userRepository;

  @Override
  public String writeToken(User user) {
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

  @Override
  public Optional<User> readToken(String token) {
    if (token == null) {
      throw new IllegalArgumentException("token is null");
    }

    try {
      Claims claims =
          Jwts.parser().verifyWith(secretKey).build().parseSignedClaims(token).getPayload();

      if (!claims.getExpiration().after(new Date())) {
        return Optional.empty();
      }

      User user =
          userRepository
              .findById(claims.getSubject())
              .orElseThrow(() -> new JwtException("subject not found"));

      return Optional.of(user);
    } catch (JwtException ex) {
      log.warn("Failed to read bearer token: {}'", ex.getMessage());

      return Optional.empty();
    }
  }
}
