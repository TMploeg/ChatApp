package com.tmploeg.chatapp.chat.chatgroup;

import com.tmploeg.chatapp.users.UserDTO;
import java.util.List;
import java.util.UUID;

public record ChatGroupDTO(UUID id, String name, List<UserDTO> users, boolean mutable) {
  public static ChatGroupDTO from(ChatGroup chatGroup) {
    return new ChatGroupDTO(
        chatGroup.getId(),
        chatGroup.getName(),
        chatGroup.getUsers().stream().map(UserDTO::from).toList(),
        chatGroup.isMutable());
  }
}
