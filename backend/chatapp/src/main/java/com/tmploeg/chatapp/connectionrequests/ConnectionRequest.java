package com.tmploeg.chatapp.connectionrequests;

import com.tmploeg.chatapp.users.User;
import jakarta.persistence.*;
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

  @ManyToOne private User connector;

  @ManyToOne private User connectee;

  @Enumerated(EnumType.ORDINAL)
  @Setter
  private ConnectionRequestState state;

  public ConnectionRequest(User connector, User connectee) {
    this.connector = connector;
    this.connectee = connectee;
    this.state = ConnectionRequestState.SEND;
  }
}
