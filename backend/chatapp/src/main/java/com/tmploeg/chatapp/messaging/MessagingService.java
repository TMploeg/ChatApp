package com.tmploeg.chatapp.messaging;

import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class MessagingService {
  private final SimpMessagingTemplate template;

  public void send(StompBroker broker, Object payload) {
    template.convertAndSend(broker.getRoute(), payload);
  }
}
