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
    seedConnectionRequests();
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

    for (int i = 0; i < users.size() - 1; i++) {
      for (int j = i + 1; j < users.size(); j++) {
        if (r.nextDouble() > 0.5) {
          continue;
        }

        boolean direction = r.nextBoolean();

        ConnectionRequest request =
            new ConnectionRequest(users.get(direction ? i : j), users.get(direction ? j : i));
        request.setState(states[r.nextInt(0, states.length)]);
        requests.add(request);
      }
    }

    connectionRequestRepository.saveAll(requests);
  }
}
