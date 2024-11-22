package com.tmploeg.chatapp;

import com.tmploeg.chatapp.chat.chatgroup.ChatGroup;
import com.tmploeg.chatapp.chat.chatgroup.ChatGroupRepository;
import com.tmploeg.chatapp.users.User;
import com.tmploeg.chatapp.users.UserRepository;
import java.util.List;
import java.util.Set;
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
    seedChatGroups();
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

  private void seedChatGroups() {
    List<User> users = userRepository.findAll();

    chatGroupRepository.save(
        new ChatGroup("Awesome group 1", Set.of(users.get(0), users.get(3), users.get(4))));
    chatGroupRepository.save(
        new ChatGroup("Awesome group 2", Set.of(users.get(0), users.get(1), users.get(2))));
    chatGroupRepository.save(
        new ChatGroup("Awesome group 3", Set.of(users.get(1), users.get(2), users.get(3))));
    chatGroupRepository.save(
        new ChatGroup("Awesome group 4", Set.of(users.get(2), users.get(3), users.get(4))));
    chatGroupRepository.save(
        new ChatGroup("Awesome group 5", Set.of(users.get(0), users.get(2), users.get(4))));

    chatGroupRepository.save(new ChatGroup(Set.of(users.get(0), users.get(3))));
    chatGroupRepository.save(new ChatGroup(Set.of(users.get(1), users.get(2))));
    chatGroupRepository.save(
        new ChatGroup(
            "Awesome group 6", Set.of(users.get(0), users.get(2), users.get(3), users.get(4))));
  }
}
