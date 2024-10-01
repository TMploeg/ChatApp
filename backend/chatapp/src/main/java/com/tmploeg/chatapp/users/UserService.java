package com.tmploeg.chatapp.users;

import java.util.Optional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService {
  private final UserRepository userRepository;
  private final PasswordEncoder passwordEncoder;

  public Optional<User> findByUsername(String username) {
    return userRepository.findById(username);
  }

  public boolean passwordMatches(User user, String password) {
    return passwordEncoder.matches(password, user.getPassword());
  }
}
