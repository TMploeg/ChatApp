package com.tmploeg.chatapp.security.interceptors;

import com.tmploeg.chatapp.security.jwt.TokenReader;
import com.tmploeg.chatapp.users.User;
import java.util.Objects;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.messaging.support.GenericMessage;
import org.springframework.messaging.support.MessageHeaderAccessor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class AuthChannelInterceptor extends AuthInterceptor implements ChannelInterceptor {
  @Value("${app.auth-header-name}")
  private String authHeaderName;

  private final TokenReader tokenReader;

  @Override
  public Message<?> preSend(Message<?> message, MessageChannel channel) {
    StompHeaderAccessor accessor =
        MessageHeaderAccessor.getAccessor(message, StompHeaderAccessor.class);

    if (accessor == null) {
      log.warn("failed to get accessor");
      return null;
    }

    // TODO enable connect without auth, but validate other messages
    if (!Objects.equals(accessor.getCommand(), StompCommand.CONNECT)) {
      return message;
    }

    String authorization = accessor.getFirstNativeHeader(authHeaderName);

    Optional<User> user = getUserFromAuthorization(authorization, tokenReader);
    if (user.isEmpty()) {
      log.info("unauthorized message blocked");
      channel.send(new GenericMessage<>("can't connect: unauthorized"));
      return null;
    }

    String username = user.get().getUsername();

    accessor.setUser(() -> username);

    return message;
  }
}
