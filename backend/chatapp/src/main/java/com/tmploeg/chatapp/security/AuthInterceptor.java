package com.tmploeg.chatapp.security;

import com.tmploeg.chatapp.users.User;
import java.util.Objects;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.messaging.support.MessageHeaderAccessor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class AuthInterceptor implements ChannelInterceptor {
  private static final Logger LOGGER = LoggerFactory.getLogger(AuthInterceptor.class);

  @Value("${app.auth-header-name}")
  private String authHeaderName;

  private final JWTService jwtService;

  @Override
  public Message<?> preSend(Message<?> message, MessageChannel channel) {
    StompHeaderAccessor accessor =
        MessageHeaderAccessor.getAccessor(message, StompHeaderAccessor.class);

    if (accessor == null) {
      LOGGER.atWarn().log("failed to get accessor");
      return null;
    }

    if (!Objects.equals(accessor.getCommand(), StompCommand.CONNECT)) {
      return message;
    }

    String authorization = accessor.getFirstNativeHeader(authHeaderName);
    User user = jwtService.readToken(authorization).orElse(null);
    if (user == null) {
      return null;
    }

    accessor.setUser(user);

    return message;
  }
}
