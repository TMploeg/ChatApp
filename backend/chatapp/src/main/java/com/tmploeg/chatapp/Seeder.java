package com.tmploeg.chatapp;

import com.tmploeg.chatapp.chat.chatgroup.ChatGroupRepository;
import com.tmploeg.chatapp.users.User;
import com.tmploeg.chatapp.users.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class Seeder implements CommandLineRunner {
  private final UserRepository userRepository;
  private final ChatGroupRepository chatGroupRepository;

  private static final int SEED_USER_COUNT = 5;

  @Override
  public void run(String... args) throws Exception {
    seedUsers();
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
}
