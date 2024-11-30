package com.tmploeg.chatapp.messaging;

import com.tmploeg.chatapp.users.User;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class MessagingService {
  private final SimpMessagingTemplate template;

  public void send(Broker broker, Object payload) {
    template.convertAndSend(broker.getDestination(), payload);
  }

  public void sendToUser(User user, Broker broker, Object payload) {
    template.convertAndSendToUser(user.getUsername(), broker.getDestination(), payload);
  }
}
