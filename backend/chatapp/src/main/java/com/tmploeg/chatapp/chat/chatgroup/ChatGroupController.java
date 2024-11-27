package com.tmploeg.chatapp.chat.chatgroup;

import com.tmploeg.chatapp.ApiRoutes;
import com.tmploeg.chatapp.connections.ConnectionService;
import com.tmploeg.chatapp.exceptions.BadRequestException;
import com.tmploeg.chatapp.exceptions.NotFoundException;
import com.tmploeg.chatapp.messaging.MessagingService;
import com.tmploeg.chatapp.messaging.StompBroker;
import com.tmploeg.chatapp.security.AuthenticationProvider;
import com.tmploeg.chatapp.users.User;
import com.tmploeg.chatapp.users.UserService;
import java.net.URI;
import java.util.*;
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
  private final MessagingService messagingService;
  private final ConnectionService connectionService;

  @GetMapping
  public List<ChatGroupDTO> getChatGroups() {
    User user = authenticationProvider.getAuthenticatedUser();

    return chatGroupService.getChatGroups(user).stream()
        .map(group -> ChatGroupDTO.from(group, user))
        .toList();
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

    return ChatGroupDTO.from(chatGroup, user);
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

    User groupCreator = authenticationProvider.getAuthenticatedUser();

    List<String> nonConnectedUsernames =
        getNonConnectedUsernames(groupCreator, Arrays.asList(newChatGroupDTO.usernames()));
    if (!nonConnectedUsernames.isEmpty()) {
      throw new BadRequestException(
          "usernames is invalid, users "
              + String.join(", ", nonConnectedUsernames + " are not in your connections"));
    }

    Set<User> groupUsers = new HashSet<>(newChatGroupDTO.usernames().length + 1);
    groupUsers.add(groupCreator);

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

    if (newChatGroupDTO.mutable()) {
      group.setMutable(true);
      chatGroupService.update(group);
    }

    sendNewChatGroupMessage(group, groupCreator);

    URI uri = ucb.path("/api/v1/chatgroups/{id}").buildAndExpand(group.getId().toString()).toUri();
    return ResponseEntity.created(uri).body(ChatGroupDTO.from(group, groupCreator));
  }

  private void sendNewChatGroupMessage(ChatGroup newGroup, User creator) {
    List<User> recipients =
        newGroup.getUsers().stream()
            .filter(u -> !u.getUsername().equals(creator.getUsername()))
            .toList();

    for (User user : recipients) {
      messagingService.sendToUser(user, StompBroker.CHAT_GROUPS, ChatGroupDTO.from(newGroup, user));
    }
  }

  private List<String> getNonConnectedUsernames(User groupCreator, List<String> usernames) {
    Set<User> connectedUsers = connectionService.getConnectedUsers(groupCreator);
    return usernames.stream()
        .filter(
            username -> connectedUsers.stream().noneMatch(u -> u.getUsername().equals(username)))
        .toList();
  }
}
