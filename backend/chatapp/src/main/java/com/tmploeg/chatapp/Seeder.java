package com.tmploeg.chatapp;

import com.tmploeg.chatapp.connectionrequests.ConnectionRequest;
import com.tmploeg.chatapp.connectionrequests.ConnectionRequestRepository;
import com.tmploeg.chatapp.connectionrequests.ConnectionRequestState;
import com.tmploeg.chatapp.users.User;
import com.tmploeg.chatapp.users.UserRepository;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class Seeder implements CommandLineRunner {
  private final UserRepository userRepository;
  private final ConnectionRequestRepository connectionRequestRepository;

  private static final int SEED_USER_COUNT = 5;

  @Override
  public void run(String... args) throws Exception {
    seedUsers();
    seedConnections();
  }

  private void seedUsers() {
    for (int i = 0; i < SEED_USER_COUNT; i++) {
      String username = "testuser_" + i;
      String password = "{noop}password";

      if (userRepository.findById(username).isPresent()) {
        continue;
      }

      userRepository.save(new User(username, password));
    }
  }

  private void seedConnections() {
    User connector = userRepository.findById("testuser_0").get();

    List<ConnectionRequest> requests =
        userRepository.findAll().stream()
            .filter(u -> !u.getUsername().equals(connector.getUsername()))
            .map(
                connectee -> {
                  ConnectionRequest request = new ConnectionRequest(connector, connectee);
                  request.setState(ConnectionRequestState.ACCEPTED);
                  return request;
                })
            .toList();

    connectionRequestRepository.saveAll(requests);
  }
}
