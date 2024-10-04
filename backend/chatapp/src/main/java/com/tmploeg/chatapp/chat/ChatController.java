package com.tmploeg.chatapp.chat;

import com.tmploeg.chatapp.routing.StompBrokers;
import com.tmploeg.chatapp.users.User;
import java.security.Principal;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

@Controller
@RequiredArgsConstructor
public class ChatController {
  private final ChatMessageService chatMessageService;

  @MessageMapping("/send")
  @SendTo(StompBrokers.CHAT)
  public ChatMessageDTO send(String content, Principal principal) {
    User user = (User) principal;

    ChatMessage message = chatMessageService.save(content, user);

    return ChatMessageDTO.from(message);
  }
}
