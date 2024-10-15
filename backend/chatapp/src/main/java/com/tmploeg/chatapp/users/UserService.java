package com.tmploeg.chatapp.users;

import java.util.Optional;
import java.util.regex.Pattern;
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

  public User create(String username, String password) {
    return userRepository.save(new User(username, passwordEncoder.encode(password)));
  }

  public boolean passwordMatches(User user, String password) {
    return passwordEncoder.matches(password, user.getPassword());
  }

  public boolean exists(String username) {
    return userRepository.existsById(username);
  }

  public boolean isValidPassword(String password) {
    int minLength = 8;
    if (password.length() < minLength) {
      return false;
    }

    String[] patterns = new String[] {"[a-z]", "[A-Z]", "[0-9]", "[!@#$%^&+=]"};

    for (String pattern : patterns) {
      if (noMatch(pattern, password)) {
        return false;
      }
    }

    return true;
  }

  private boolean noMatch(String regEx, String input) {
    return !Pattern.compile(regEx).matcher(input).find();
  }
}
