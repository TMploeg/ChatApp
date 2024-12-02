package com.tmploeg.chatapp.chat.chatgroup.dtos;

import com.tmploeg.chatapp.chat.chatgroup.ChatGroup;
import com.tmploeg.chatapp.users.User;
import com.tmploeg.chatapp.users.UserDTO;
import java.util.Comparator;
import java.util.List;
import java.util.UUID;

public record ChatGroupDTO(UUID id, String name, List<UserDTO> users, boolean closed) {
  public static ChatGroupDTO from(ChatGroup chatGroup, User receivingUser) {
    List<User> users =
        chatGroup.getUsers().stream()
            .filter(u -> !u.getUsername().equals(receivingUser.getUsername()))
            .sorted(Comparator.comparing(User::getUsername))
            .toList();

    return new ChatGroupDTO(
        chatGroup.getId(),
        chatGroup.getName().orElse(null),
        users.stream().map(UserDTO::from).toList(),
        chatGroup.isClosed());
  }
}
