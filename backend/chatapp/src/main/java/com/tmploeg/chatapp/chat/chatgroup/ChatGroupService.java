package com.tmploeg.chatapp.chat.chatgroup;

import com.tmploeg.chatapp.users.User;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ChatGroupService {
  private final ChatGroupRepository chatGroupRepository;

  public Set<ChatGroup> getChatGroups(User user) {
    return chatGroupRepository.findChatGroupsForUser(user);
  }

  public Optional<ChatGroup> getByIdForUser(UUID id, User user) {
    return chatGroupRepository.findByIdForUser(id, user);
  }

  public boolean existsByIdForUser(UUID id, String username) {
    return chatGroupRepository.existsByIdForUser(id, username);
  }

  public ChatGroup create(Set<User> users) {
    return chatGroupRepository.save(new ChatGroup(users));
  }

  public ChatGroup create(Set<User> users, String name) {
    return chatGroupRepository.save(new ChatGroup(name, users));
  }

  public void update(ChatGroup chatGroup) {
    chatGroupRepository.save(chatGroup);
  }
}
