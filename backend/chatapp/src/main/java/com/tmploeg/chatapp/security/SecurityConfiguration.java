package com.tmploeg.chatapp.security;

import com.tmploeg.chatapp.security.jwt.JWTService;
import com.tmploeg.chatapp.security.jwt.TokenReader;
import com.tmploeg.chatapp.security.jwt.TokenWriter;
import io.jsonwebtoken.Jwts;
import javax.crypto.SecretKey;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.factory.PasswordEncoderFactories;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class SecurityConfiguration {
  @Bean
  public PasswordEncoder passwordEncoder() {
    return PasswordEncoderFactories.createDelegatingPasswordEncoder();
  }

  @Bean
  public SecretKey secretKey() {
    return Jwts.SIG.HS256.key().build();
  }

  @Bean
  public TokenWriter tokenWriter(JWTService jwtService) {
    return jwtService;
  }

  @Bean
  public TokenReader tokenReader(JWTService jwtService) {
    return jwtService;
  }
}
