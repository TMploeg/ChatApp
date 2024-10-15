package com.tmploeg.chatapp.security;

import com.tmploeg.chatapp.exceptions.BadRequestException;
import com.tmploeg.chatapp.users.User;
import com.tmploeg.chatapp.users.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@CrossOrigin("${app.cors}")
public class AuthController {
  private final UserService userService;
  private final JWTService jwtService;

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

    String token = jwtService.createToken(user);

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

    return new TokenDTO(jwtService.createToken(newUser), newUser.getUsername());
  }
}
