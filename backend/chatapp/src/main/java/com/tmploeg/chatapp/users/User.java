package com.tmploeg.chatapp.users;

import jakarta.persistence.*;
import java.security.Principal;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity(name = "users")
@NoArgsConstructor
public class User implements Principal {
  @Id @Getter private String username;

  @Getter private String password;

  @Enumerated(EnumType.ORDINAL)
  @Getter
  private UserRole role;

  public User(String username, String password) {
    this.username = username;
    this.password = password;
    this.role = UserRole.USER;
  }

  @Override
  public String getName() {
    return username;
  }
}
