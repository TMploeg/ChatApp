package com.tmploeg.chatapp.chat.chatgroup;

import com.tmploeg.chatapp.users.User;
import java.util.Set;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ChatGroupService {
  private final ChatGroupRepository chatGroupRepository;

  public Set<ChatGroup> getChatGroups(User user) {
    return chatGroupRepository.findChatGroupsForUser(user);
  }
}
