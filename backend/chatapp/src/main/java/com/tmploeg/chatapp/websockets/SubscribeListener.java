package com.tmploeg.chatapp.websockets;

import com.tmploeg.chatapp.chat.*;
import com.tmploeg.chatapp.routing.StompBrokers;
import com.tmploeg.chatapp.routing.StompRoutes;
import java.security.Principal;
import java.util.List;
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
        sendHistory(event, ChatHistoryType.GLOBAL, chatMessageService.getChatHistory());
        break;
      case StompRoutes.USER_DESTINATION + StompBrokers.HISTORY:
        sendHistory(event, ChatHistoryType.CONFIRMATION, List.of());
      default:
        break;
    }
  }

  private void sendHistory(
      SessionSubscribeEvent event, ChatHistoryType type, List<ChatMessage> messages) {
    Principal user = event.getUser();
    if (user == null) {
      LOGGER.atError().log(USER_NOT_FOUND_ERROR_MESSAGE);
      return;
    }

    template.convertAndSendToUser(
        user.getName(),
        StompBrokers.HISTORY,
        new ChatHistoryDTO(type, messages.stream().map(ChatMessageDTO::from).toList()));
  }
}
