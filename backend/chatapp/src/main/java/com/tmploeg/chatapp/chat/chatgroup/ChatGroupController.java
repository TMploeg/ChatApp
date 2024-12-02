package com.tmploeg.chatapp.chat.chatgroup;

import com.tmploeg.chatapp.ApiRoutes;
import com.tmploeg.chatapp.chat.chatgroup.dtos.ChatGroupDTO;
import com.tmploeg.chatapp.chat.chatgroup.dtos.ClosedChatGroupDTO;
import com.tmploeg.chatapp.chat.chatgroup.dtos.NewChatGroupDTO;
import com.tmploeg.chatapp.connections.ConnectionService;
import com.tmploeg.chatapp.exceptions.BadRequestException;
import com.tmploeg.chatapp.exceptions.ForbiddenException;
import com.tmploeg.chatapp.exceptions.NotFoundException;
import com.tmploeg.chatapp.messaging.Broker;
import com.tmploeg.chatapp.messaging.MessagingService;
import com.tmploeg.chatapp.security.AuthenticationProvider;
import com.tmploeg.chatapp.users.User;
import com.tmploeg.chatapp.users.UserService;
import java.net.URI;
import java.util.*;
import java.util.stream.Collectors;
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

  @GetMapping("closed")
  public List<ClosedChatGroupDTO> getClosedChatGroups() {
    User user = authenticationProvider.getAuthenticatedUser();

    return chatGroupService.getClosedChatGroups(user).stream()
        .map((group) -> ClosedChatGroupDTO.from(group, user))
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
    if (newChatGroupDTO.closed() && newChatGroupDTO.usernames().length > 1) {
      throw new BadRequestException("closed requests can have only one username");
    }

    User groupCreator = authenticationProvider.getAuthenticatedUser();

    if (hasNonConnectedUser(groupCreator, newChatGroupDTO.usernames())) {
      throw new BadRequestException(
          "usernames is invalid, one or more are not in your connections");
    }

    Set<User> groupUsers = getGroupUsers(groupCreator, newChatGroupDTO.usernames());

    if (newChatGroupDTO.closed()) {
      if (chatGroupService.closedGroupExistsForUsers(groupUsers)) {
        throw new ForbiddenException("chat group already exists");
      }
    }

    ChatGroup newGroup = createChatGroup(newChatGroupDTO, groupUsers);

    sendNewChatGroupMessage(newGroup);

    URI uri =
        ucb.path("/api/v1/chatgroups/{id}").buildAndExpand(newGroup.getId().toString()).toUri();
    return ResponseEntity.created(uri).body(ChatGroupDTO.from(newGroup, groupCreator));
  }

  private boolean hasNonConnectedUser(User creator, String[] usernames) {
    Set<User> connectedUsers = connectionService.getConnectedUsers(creator);

    for (String username : usernames) {
      boolean anyMatch = false;

      for (User connectedUser : connectedUsers) {
        if (connectedUser.getUsername().equals(username)) {
          anyMatch = true;
          break;
        }
      }

      if (!anyMatch) {
        return true;
      }
    }

    return false;
  }

  private Set<User> getGroupUsers(User creator, String[] usernames) {
    Set<User> groupUsers =
        Arrays.stream(usernames)
            .map(
                username ->
                    userService
                        .findByUsername(username)
                        .orElseThrow(
                            () -> new BadRequestException("one or more usernames not found")))
            .collect(Collectors.toSet());
    groupUsers.add(creator);

    return groupUsers;
  }

  private ChatGroup createChatGroup(NewChatGroupDTO newChatGroupDTO, Set<User> users) {
    if (newChatGroupDTO.closed()) {
      return chatGroupService.createClosedGroup(users);
    }

    if (newChatGroupDTO.name() == null) {
      return chatGroupService.create(users);
    }

    return chatGroupService.create(users, newChatGroupDTO.name());
  }

  private void sendNewChatGroupMessage(ChatGroup newGroup) {

    for (User user : newGroup.getUsers()) {
      messagingService.sendToUser(user, Broker.CHAT_GROUPS, ChatGroupDTO.from(newGroup, user));
    }
  }
}
