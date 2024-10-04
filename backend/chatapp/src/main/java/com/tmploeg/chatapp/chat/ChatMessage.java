package com.tmploeg.chatapp.chat;

import com.tmploeg.chatapp.users.User;
import jakarta.persistence.*;
import java.util.UUID;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@NoArgsConstructor
@Getter
public class ChatMessage {
  @Id
  @GeneratedValue(strategy = GenerationType.UUID)
  private UUID messageId;

  private String content;

  @ManyToOne private User sender;

  public ChatMessage(String content, User sender) {
    this.content = content;
    this.sender = sender;
  }
}
