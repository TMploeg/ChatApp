package com.tmploeg.chatapp;

import com.tmploeg.chatapp.connectionrequests.ConnectionRequest;
import com.tmploeg.chatapp.connectionrequests.ConnectionRequestRepository;
import com.tmploeg.chatapp.connectionrequests.ConnectionRequestState;
import com.tmploeg.chatapp.users.User;
import com.tmploeg.chatapp.users.UserRepository;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class Seeder implements CommandLineRunner {
  private final UserRepository userRepository;
  private final ConnectionRequestRepository connectionRequestRepository;

  private static final int SEED_USER_COUNT = 20;

  @Override
  public void run(String... args) throws Exception {
    seedUsers();
    //    seedConnectionRequests();
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

  private void seedConnectionRequests() {
    if (connectionRequestRepository.count() > 0) {
      return;
    }

    List<User> users = userRepository.findAll();
    Random r = new Random();

    ConnectionRequestState[] states = ConnectionRequestState.values();
    List<ConnectionRequest> requests = new ArrayList<>();

    User user0 =
        userRepository
            .findById("testuser_0")
            .orElseThrow(() -> new RuntimeException("user not found"));

    for (int i = 0; i < users.size() - 1; i++) {
      if (r.nextDouble() > 0.75) {
        continue;
      }

      User current = users.get(i);

      User connector = r.nextBoolean() ? user0 : current;
      User connectee = connector == user0 ? current : user0;

      ConnectionRequest request = new ConnectionRequest(connector, connectee);
      request.setState(states[r.nextInt(0, states.length)]);
      requests.add(request);
    }

    connectionRequestRepository.saveAll(requests);
  }
}
