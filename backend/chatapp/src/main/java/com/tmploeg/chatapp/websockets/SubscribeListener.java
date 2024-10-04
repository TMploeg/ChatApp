package com.tmploeg.chatapp.websockets;

import com.tmploeg.chatapp.chat.ChatHistoryDTO;
import com.tmploeg.chatapp.chat.ChatMessageDTO;
import com.tmploeg.chatapp.chat.ChatMessageService;
import com.tmploeg.chatapp.routing.StompBrokers;
import com.tmploeg.chatapp.routing.StompRoutes;
import java.security.Principal;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.ApplicationListener;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.SessionSubscribeEvent;

@Component
@RequiredArgsConstructor
public class SubscribeListener implements ApplicationListener<SessionSubscribeEvent> {
  private static final Logger LOGGER = LoggerFactory.getLogger(SubscribeListener.class);

  private static final String DESTINATION_HEADER_NAME = "simpDestination";
  private static final String USER_NOT_FOUND_ERROR_MESSAGE = "user not found";

  private final SimpMessagingTemplate template;
  private final ChatMessageService chatMessageService;

  @Override
  public void onApplicationEvent(SessionSubscribeEvent event) {
    String destination = event.getMessage().getHeaders().get(DESTINATION_HEADER_NAME, String.class);
    if (destination == null) {
      return;
    }

    switch (destination) {
      case StompBrokers.CHAT:
        sendHistory(event);
        break;
      case StompRoutes.USER_DESTINATION + StompBrokers.HISTORY:
        sendHistoryConfirmation(event);
      default:
        break;
    }
  }

  private void sendHistory(SessionSubscribeEvent event) {
    Principal user = event.getUser();
    if (user == null) {
      LOGGER.atError().log(USER_NOT_FOUND_ERROR_MESSAGE);
      return;
    }

    template.convertAndSendToUser(
        user.getName(),
        StompBrokers.HISTORY,
        new ChatHistoryDTO(
            chatMessageService.getChatHistory().stream().map(ChatMessageDTO::from).toList()));
  }

  private void sendHistoryConfirmation(SessionSubscribeEvent event) {
    Principal user = event.getUser();
    if (user == null) {
      LOGGER.atError().log(USER_NOT_FOUND_ERROR_MESSAGE);
      return;
    }

    template.convertAndSendToUser(user.getName(), StompBrokers.HISTORY, new ChatHistoryDTO(null));
  }
}
