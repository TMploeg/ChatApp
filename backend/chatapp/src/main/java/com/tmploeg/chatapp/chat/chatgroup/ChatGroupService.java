package com.tmploeg.chatapp.chat.chatgroup;

import com.tmploeg.chatapp.users.User;
import java.util.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ChatGroupService {
  private final ChatGroupRepository chatGroupRepository;

  public Set<ChatGroup> getChatGroups(User user) {
    return chatGroupRepository.findChatGroupsForUser(user);
  }

  public Set<ChatGroup> getClosedChatGroups(User user) {
    return chatGroupRepository.findClosedChatGroupsForUser(user);
  }

  public Optional<ChatGroup> getByIdForUser(UUID id, User user) {
    return chatGroupRepository.findByIdForUser(id, user);
  }

  public boolean existsByIdForUser(UUID id, String username) {
    return chatGroupRepository.existsByIdForUser(id, username);
  }

  public ChatGroup create(Set<User> users) {
    return chatGroupRepository.save(new ChatGroup(users, false));
  }

  public ChatGroup create(Set<User> users, String name) {
    return chatGroupRepository.save(new ChatGroup(name, users, false));
  }

  public ChatGroup createClosedGroup(Set<User> users) {
    return chatGroupRepository.save(new ChatGroup(users, true));
  }

  public boolean closedGroupExistsForUsers(Collection<User> users) {
    return chatGroupRepository.existsForUsers(users);
  }

  public void update(ChatGroup chatGroup) {
    chatGroupRepository.save(chatGroup);
  }
}
