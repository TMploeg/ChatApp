package com.tmploeg.chatapp.chat;

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

  public ChatMessage(String content) {
    this.content = content;
  }
}
