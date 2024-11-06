package com.tmploeg.chatapp.security;

import com.tmploeg.chatapp.ApiRoutes;
import com.tmploeg.chatapp.exceptions.BadRequestException;
import com.tmploeg.chatapp.security.jwt.TokenDTO;
import com.tmploeg.chatapp.security.jwt.TokenWriter;
import com.tmploeg.chatapp.users.User;
import com.tmploeg.chatapp.users.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping(ApiRoutes.AUTH)
@RequiredArgsConstructor
@CrossOrigin("${app.cors}")
@Public
public class AuthController {
  private final UserService userService;
  private final TokenWriter tokenWriter;

  @PostMapping("login")
  public TokenDTO login(@RequestBody AuthDTO authDTO) {
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

    String token = tokenWriter.writeToken(user);

    return new TokenDTO(token, user.getUsername());
  }

  @PostMapping("register")
  public TokenDTO register(@RequestBody AuthDTO authDTO) {
    if (authDTO.username() == null || authDTO.username().isBlank()) {
      throw new BadRequestException("username is required");
    }
    if (authDTO.password() == null || authDTO.password().isBlank()) {
      throw new BadRequestException("password is required");
    }
    if (userService.exists(authDTO.username())
        || !userService.isValidPassword(authDTO.password())) {
      throw new BadRequestException("username or password is invalid");
    }

    User newUser = userService.create(authDTO.username(), authDTO.password());

    return new TokenDTO(tokenWriter.writeToken(newUser), newUser.getUsername());
  }
}
