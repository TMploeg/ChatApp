package com.tmploeg.chatapp.connectionrequests;

import com.tmploeg.chatapp.users.User;
import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.UUID;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@NoArgsConstructor
@Getter
public class ConnectionRequest {
  @Id
  @GeneratedValue(strategy = GenerationType.UUID)
  private UUID id;

  @ManyToOne(fetch = FetchType.LAZY)
  private User connector;

  @ManyToOne(fetch = FetchType.LAZY)
  private User connectee;

  @Enumerated(EnumType.ORDINAL)
  @Setter
  private ConnectionRequestState state;

  @Temporal(TemporalType.TIMESTAMP)
  private LocalDateTime sendAt;

  public ConnectionRequest(User connector, User connectee, LocalDateTime sendAt) {
    this.connector = connector;
    this.connectee = connectee;
    this.state = ConnectionRequestState.SEND;
    this.sendAt = sendAt;
  }
}
