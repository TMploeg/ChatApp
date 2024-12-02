package com.tmploeg.chatapp.chat.chatgroup;

import com.tmploeg.chatapp.users.User;
import jakarta.persistence.*;
import java.util.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@NoArgsConstructor
public class ChatGroup {
  @Getter
  @Id
  @GeneratedValue(strategy = GenerationType.UUID)
  private UUID id;

  @Setter private String name;

  @Getter
  @ManyToMany(fetch = FetchType.EAGER)
  private Set<User> users = new HashSet<>();

  @Getter private boolean closed = true;

  public ChatGroup(Set<User> users, boolean closed) {
    this.users = users;
    this.closed = closed;
  }

  public ChatGroup(String name, Set<User> users, boolean closed) {
    this.users = users;
    this.name = name;
    this.closed = closed;
  }

  public Optional<String> getName() {
    return Optional.ofNullable(name);
  }
}
