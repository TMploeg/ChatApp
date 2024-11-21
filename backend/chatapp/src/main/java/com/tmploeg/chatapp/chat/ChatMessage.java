package com.tmploeg.chatapp.chat;

import com.tmploeg.chatapp.chat.chatgroup.ChatGroup;
import com.tmploeg.chatapp.users.User;
import jakarta.persistence.*;
import java.time.LocalDateTime;
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

  @Temporal(TemporalType.TIMESTAMP)
  private LocalDateTime sendAt;

  @ManyToOne private ChatGroup group;

  public ChatMessage(String content, User sender, LocalDateTime sendAt) {
    this.content = content;
    this.sender = sender;
    this.sendAt = sendAt;
  }
}
