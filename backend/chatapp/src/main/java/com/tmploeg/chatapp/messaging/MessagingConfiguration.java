package com.tmploeg.chatapp.messaging;

import com.tmploeg.chatapp.security.interceptors.AuthChannelInterceptor;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.messaging.simp.config.ChannelRegistration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.*;

@Configuration
@EnableWebSocketMessageBroker
@RequiredArgsConstructor
@Order(Ordered.HIGHEST_PRECEDENCE + 99)
public class MessagingConfiguration implements WebSocketMessageBrokerConfigurer {
  private final AuthChannelInterceptor authChannelInterceptor;

  @Value("${app.cors}")
  private String cors;

  @Override
  public void configureMessageBroker(MessageBrokerRegistry registry) {
    registry.enableSimpleBroker(
        StompBroker.CHAT.getRoute(),
        StompBroker.CONNECTION_REQUESTS.getRoute(),
        StompBroker.CHAT_GROUPS.getRoute());
    registry.setUserDestinationPrefix("/user");
  }

  @Override
  public void registerStompEndpoints(StompEndpointRegistry registry) {
    String stompEndpoint = "/stomp";
    registry.addEndpoint(stompEndpoint).setAllowedOrigins(cors);
    registry.addEndpoint(stompEndpoint).setAllowedOrigins(cors).withSockJS();
  }

  @Override
  public void configureClientInboundChannel(ChannelRegistration registration) {
    registration.interceptors(authChannelInterceptor);
  }
}
