package com.tmploeg.chatapp.security;

import com.tmploeg.chatapp.users.UserDetailsServiceImpl;
import io.jsonwebtoken.Jwts;
import javax.crypto.SecretKey;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.ProviderManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.annotation.web.socket.EnableWebSocketSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.factory.PasswordEncoderFactories;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSocketSecurity
@RequiredArgsConstructor
public class SecurityConfiguration {
  private final UserDetailsServiceImpl userDetailsService;

  @Bean
  public SecurityFilterChain securityFilterChain(HttpSecurity http, JWTFilter filter)
      throws Exception {
    return http.csrf(AbstractHttpConfigurer::disable)
        .cors(AbstractHttpConfigurer::disable)
        .authorizeHttpRequests(auth -> auth.anyRequest().authenticated())
        .addFilterBefore(filter, UsernamePasswordAuthenticationFilter.class)
        .sessionManagement(config -> config.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
        .exceptionHandling(
            config -> {
              config.authenticationEntryPoint(
                  (request, response, exception) -> response.sendError(401, "Unauthorized"));
              config.accessDeniedHandler(
                  ((request, response, exception) -> response.sendError(403, "Forbidden")));
            })
        .build();
  }

  @Bean
  public PasswordEncoder passwordEncoder() {
    return PasswordEncoderFactories.createDelegatingPasswordEncoder();
  }

  @Bean
  public AuthenticationManager authorizationManager(PasswordEncoder passwordEncoder) {
    DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider(passwordEncoder);
    authProvider.setUserDetailsService(userDetailsService);

    return new ProviderManager(authProvider);
  }

  @Bean
  public SecretKey secretKey() {
    return Jwts.SIG.HS256.key().build();
  }
}
