package com.tmploeg.chatapp.chat;

import com.tmploeg.chatapp.chat.chatgroup.ChatGroup;
import com.tmploeg.chatapp.chat.chatgroup.ChatGroupRepository;
import com.tmploeg.chatapp.exceptions.BadRequestException;
import com.tmploeg.chatapp.exceptions.ForbiddenException;
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
    ChatGroup group = tryGetChatGroupById(groupId);

    if (!chatGroupRepository.existsByIdForUser(group.getId(), sender.getUsername())) {
      throw new ForbiddenException("user not part of chatgroup");
    }

    return chatMessageRepository.save(
        new ChatMessage(message, sender, LocalDateTime.now(), tryGetChatGroupById(groupId)));
  }

  public Set<ChatMessage> getChatHistory(String groupId, User user) {
    ChatGroup group = tryGetChatGroupById(groupId);

    if (!chatGroupRepository.existsByIdForUser(group.getId(), user.getUsername())) {
      throw new ForbiddenException("user not part of chatgroup");
    }

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
