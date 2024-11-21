package com.tmploeg.chatapp.chat.chatgroup;

import com.tmploeg.chatapp.users.UserDTO;
import java.util.List;
import java.util.UUID;

public record ChatGroupDTO(UUID id, List<UserDTO> users) {
  public static ChatGroupDTO from(ChatGroup chatGroup) {
    return new ChatGroupDTO(
        chatGroup.getId(), chatGroup.getUsers().stream().map(UserDTO::from).toList());
  }
}
