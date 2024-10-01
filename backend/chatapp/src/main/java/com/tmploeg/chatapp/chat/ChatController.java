package com.tmploeg.chatapp.chat;

import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

@Controller
@RequiredArgsConstructor
public class ChatController {
  private final ChatMessageService chatMessageService;

  @MessageMapping("/chat")
  @SendTo("/topic/messages")
  public ChatMessage send(String content) throws Exception {
    System.out.println("TEstTestsTEST");
    return chatMessageService.save(content);
  }
}
