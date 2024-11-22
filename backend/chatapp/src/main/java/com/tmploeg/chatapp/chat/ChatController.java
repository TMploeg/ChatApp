package com.tmploeg.chatapp.chat;

import com.tmploeg.chatapp.ApiRoutes;
import com.tmploeg.chatapp.exceptions.BadRequestException;
import com.tmploeg.chatapp.messaging.MessagingService;
import com.tmploeg.chatapp.messaging.StompBroker;
import com.tmploeg.chatapp.security.AuthenticationProvider;
import com.tmploeg.chatapp.users.User;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping(ApiRoutes.CHAT)
@RequiredArgsConstructor
@CrossOrigin("${app.cors}")
public class ChatController {
  private final ChatMessageService chatMessageService;
  private final MessagingService messagingService;
  private final AuthenticationProvider authenticationProvider;

  @GetMapping
  public List<ChatMessageDTO> getChatHistory(@RequestParam(name = "groupId") String groupId) {
    if (groupId == null || groupId.isBlank()) {
      throw new BadRequestException("group is required");
    }

    return chatMessageService
        .getChatHistory(groupId, authenticationProvider.getAuthenticatedUser())
        .stream()
        .map(ChatMessageDTO::from)
        .toList();
  }

  @PostMapping
  @ResponseStatus(HttpStatus.NO_CONTENT)
  public void send(
      @RequestBody NewMessageDTO newMessageDTO, @RequestParam(name = "groupId") String groupId) {
    if (groupId == null || groupId.isBlank()) {
      throw new BadRequestException("groupId is required");
    }

    User user = authenticationProvider.getAuthenticatedUser();

    ChatMessage message = chatMessageService.save(newMessageDTO.content(), user, groupId);
    messagingService.send(StompBroker.CHAT, ChatMessageDTO.from(message));
  }
}
