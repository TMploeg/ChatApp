package com.tmploeg.chatapp.connections;

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
@RequestMapping(ApiRoutes.CONNECTIONS)
@RequiredArgsConstructor
@CrossOrigin("${app.cors}")
public class ConnectionController {
  private final AuthenticationProvider authenticationProvider;
  private final ConnectionService connectionService;

  @GetMapping
  public List<ConnectionDTO> getAll() {
    User user = authenticationProvider.getAuthenticatedUser();

    return connectionService.getConnectedUsers(user).stream()
        .map(u -> new ConnectionDTO(u.getUsername()))
        .toList();
  }
}
