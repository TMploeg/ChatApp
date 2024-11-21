package com.tmploeg.chatapp.chat.chatgroup;

import com.tmploeg.chatapp.ApiRoutes;
import com.tmploeg.chatapp.security.AuthenticationProvider;
import com.tmploeg.chatapp.users.User;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(ApiRoutes.CHAT_GROUPS)
@RequiredArgsConstructor
@CrossOrigin("${app.cors}")
public class ChatGroupController {
  private final AuthenticationProvider authenticationProvider;
  private final ChatGroupService chatGroupService;

  @GetMapping
  public List<ChatGroupDTO> getChatGroups() {
    User user = authenticationProvider.getAuthenticatedUser();

    return chatGroupService.getChatGroups(user).stream().map(ChatGroupDTO::from).toList();
  }
}
