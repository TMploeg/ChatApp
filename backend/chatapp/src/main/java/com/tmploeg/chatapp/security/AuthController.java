package com.tmploeg.chatapp.security;

import com.tmploeg.chatapp.exceptions.BadRequestException;
import com.tmploeg.chatapp.users.User;
import com.tmploeg.chatapp.users.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {
  private final UserService userService;
  private final JWTService jwtService;

  @PostMapping("login")
  public String login(@RequestBody AuthDTO authDTO) {
    if (authDTO.username() == null || authDTO.username().isBlank()) {
      throw new BadRequestException("username is required");
    }
    if (authDTO.password() == null || authDTO.password().isBlank()) {
      throw new BadRequestException("password is required");
    }

    User user =
        userService
            .findByUsername(authDTO.username())
            .filter(u -> userService.passwordMatches(u, authDTO.password()))
            .orElseThrow(() -> new BadRequestException("username or password is incorrect"));

    return jwtService.createToken(user);
  }
}
