package com.tmploeg.chatapp.websockets;

import com.tmploeg.chatapp.AppRoutes;
import com.tmploeg.chatapp.security.AuthInterceptor;
import lombok.RequiredArgsConstructor;
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

  @Override
  public void configureMessageBroker(MessageBrokerRegistry registry) {
    registry.enableSimpleBroker(AppRoutes.TOPIC);
    registry.setApplicationDestinationPrefixes(AppRoutes.APP);
    registry.setUserDestinationPrefix(AppRoutes.USER);
  }

  @Override
  public void registerStompEndpoints(StompEndpointRegistry registry) {
    registry.addEndpoint(AppRoutes.STOMP).setAllowedOrigins("*");
    registry.addEndpoint(AppRoutes.STOMP).setAllowedOrigins("*").withSockJS();
  }

  @Override
  public void configureClientInboundChannel(ChannelRegistration registration) {
    registration.interceptors(authInterceptor);
  }
}
