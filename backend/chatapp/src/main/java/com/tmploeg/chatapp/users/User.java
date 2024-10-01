package com.tmploeg.chatapp.users;

import jakarta.persistence.Entity;
import java.util.Collection;
import java.util.List;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

@Entity
@NoArgsConstructor
@Getter
public class User implements UserDetails {
  private String username;

  private String password;

  private Collection<GrantedAuthority> authorities;

  public User(String username, String password) {
    this.username = username;
    this.password = password;
    this.authorities = List.of(UserRole.USER::toString);
  }
}
