package com.tmploeg.chatapp.chat;

import com.tmploeg.chatapp.chat.chatgroup.ChatGroup;
import com.tmploeg.chatapp.chat.chatgroup.ChatGroupRepository;
import com.tmploeg.chatapp.exceptions.BadRequestException;
import com.tmploeg.chatapp.users.User;
import java.time.LocalDateTime;
import java.util.Set;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ChatMessageService {
  private final ChatMessageRepository chatMessageRepository;
  private final ChatGroupRepository chatGroupRepository;

  public ChatMessage save(String message, User sender, String groupId) {
    return chatMessageRepository.save(
        new ChatMessage(message, sender, LocalDateTime.now(), tryGetChatGroupById(groupId)));
  }

  public Set<ChatMessage> getChatHistory(String groupId, User user) {
    return chatMessageRepository.getChatGroupHistory(tryGetChatGroupById(groupId), user);
  }

  private ChatGroup tryGetChatGroupById(String id) {
    try {
      return chatGroupRepository
          .findById(UUID.fromString(id))
          .orElseThrow(this::groupDoesNotExistException);
    } catch (IllegalArgumentException ignored) {
      throw groupDoesNotExistException();
    }
  }

  private BadRequestException groupDoesNotExistException() {
    return new BadRequestException("group does not exist");
  }
}
