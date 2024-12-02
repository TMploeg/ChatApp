package com.tmploeg.chatapp.chat.chatgroup.dtos;

import com.tmploeg.chatapp.chat.chatgroup.ChatGroup;
import com.tmploeg.chatapp.users.User;
import com.tmploeg.chatapp.users.UserDTO;
import java.util.UUID;

public record ClosedChatGroupDTO(UUID id, UserDTO subject) {
  public static ClosedChatGroupDTO from(ChatGroup chatGroup, User receivingUser) {
    User subject =
        chatGroup.getUsers().stream()
            .filter(u -> !u.getUsername().equals(receivingUser.getUsername()))
            .findFirst()
            .orElseThrow(() -> new RuntimeException("should have at least one other user"));

    return new ClosedChatGroupDTO(chatGroup.getId(), UserDTO.from(subject));
  }
}
