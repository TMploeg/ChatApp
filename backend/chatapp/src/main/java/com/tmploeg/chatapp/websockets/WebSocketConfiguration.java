package com.tmploeg.chatapp.websockets;

import com.tmploeg.chatapp.routing.StompRoutes;
import com.tmploeg.chatapp.security.AuthInterceptor;
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
public class WebSocketConfiguration implements WebSocketMessageBrokerConfigurer {
  private final AuthInterceptor authInterceptor;

  @Value("${app.cors}")
  private String cors;

  @Override
  public void configureMessageBroker(MessageBrokerRegistry registry) {
    registry.enableSimpleBroker(StompRoutes.BROKERS);
    registry.setApplicationDestinationPrefixes(StompRoutes.APP_DESTINATION);
    registry.setUserDestinationPrefix(StompRoutes.USER_DESTINATION);
  }

  @Override
  public void registerStompEndpoints(StompEndpointRegistry registry) {
    registry.addEndpoint(StompRoutes.ENDPOINT).setAllowedOrigins(cors);
    registry.addEndpoint(StompRoutes.ENDPOINT).setAllowedOrigins(cors).withSockJS();
  }

  @Override
  public void configureClientInboundChannel(ChannelRegistration registration) {
    registration.interceptors(authInterceptor);
  }
}
