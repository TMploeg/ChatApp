package com.tmploeg.chatapp.chat;

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
  @SendTo("/topic")
  public ChatMessage send(String content, Principal principal) throws Exception {
    User user = (User) principal;
    return chatMessageService.save(content);
  }
}
