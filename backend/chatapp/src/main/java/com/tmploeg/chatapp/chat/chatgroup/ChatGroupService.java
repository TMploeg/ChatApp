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
    return chatGroupRepository.findChatGroupForUserById(id, user);
  }

  public ChatGroup create(Set<User> users) {
    return chatGroupRepository.save(new ChatGroup(users));
  }

  public ChatGroup create(Set<User> users, String name) {
    return chatGroupRepository.save(new ChatGroup(name, users));
  }
}
