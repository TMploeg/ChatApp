package com.tmploeg.chatapp.chat.chatgroup;

import com.tmploeg.chatapp.users.User;
import jakarta.persistence.*;
import java.util.HashSet;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@NoArgsConstructor
public class ChatGroup {
  @Getter
  @Id
  @GeneratedValue(strategy = GenerationType.UUID)
  private UUID id;

  private String name;

  @Getter
  @ManyToMany(fetch = FetchType.EAGER)
  private Set<User> users = new HashSet<>();

  public ChatGroup(Set<User> users) {
    this.users = users;
  }

  public ChatGroup(String name, Set<User> users) {
    this.users = users;
    this.name = name;
  }

  public Optional<String> getName() {
    return Optional.ofNullable(name);
  }
}
