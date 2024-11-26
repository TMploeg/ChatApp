package com.tmploeg.chatapp.chat.chatgroup;

import com.tmploeg.chatapp.ApiRoutes;
import com.tmploeg.chatapp.exceptions.BadRequestException;
import com.tmploeg.chatapp.exceptions.NotFoundException;
import com.tmploeg.chatapp.security.AuthenticationProvider;
import com.tmploeg.chatapp.users.User;
import com.tmploeg.chatapp.users.UserService;
import java.net.URI;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.util.UriComponentsBuilder;

@RestController
@RequestMapping(ApiRoutes.CHAT_GROUPS)
@RequiredArgsConstructor
@CrossOrigin("${app.cors}")
public class ChatGroupController {
  private final AuthenticationProvider authenticationProvider;
  private final ChatGroupService chatGroupService;
  private final UserService userService;

  @GetMapping
  public List<ChatGroupDTO> getChatGroups() {
    User user = authenticationProvider.getAuthenticatedUser();

    return chatGroupService.getChatGroups(user).stream().map(ChatGroupDTO::from).toList();
  }

  @GetMapping("{id}")
  public ChatGroupDTO getChatGroup(@PathVariable String id) {
    User user = authenticationProvider.getAuthenticatedUser();

    UUID parsedId;
    try {
      parsedId = UUID.fromString(id);
    } catch (IllegalArgumentException ignored) {
      throw new NotFoundException();
    }

    ChatGroup chatGroup =
        chatGroupService.getByIdForUser(parsedId, user).orElseThrow(NotFoundException::new);

    return ChatGroupDTO.from(chatGroup);
  }

  @PostMapping
  public ResponseEntity<ChatGroupDTO> createChatGroup(
      @RequestBody NewChatGroupDTO newChatGroupDTO, UriComponentsBuilder ucb) {
    if (newChatGroupDTO.usernames() == null) {
      throw new BadRequestException("usernames is required");
    }
    if (newChatGroupDTO.usernames().length == 0) {
      throw new BadRequestException("usernames can't be empty");
    }

    Set<User> groupUsers = new HashSet<>(newChatGroupDTO.usernames().length + 1);
    groupUsers.add(authenticationProvider.getAuthenticatedUser());

    for (String username : newChatGroupDTO.usernames()) {
      User user =
          userService
              .findByUsername(username)
              .orElseThrow(
                  () -> new BadRequestException("one or more users in 'usernames' is invalid"));

      groupUsers.add(user);
    }

    ChatGroup group =
        newChatGroupDTO.name() == null
            ? chatGroupService.create(groupUsers)
            : chatGroupService.create(groupUsers, newChatGroupDTO.name());

    URI uri = ucb.path("/api/v1/chatgroups/{id}").buildAndExpand(group.getId().toString()).toUri();

    return ResponseEntity.created(uri).body(ChatGroupDTO.from(group));
  }
}
