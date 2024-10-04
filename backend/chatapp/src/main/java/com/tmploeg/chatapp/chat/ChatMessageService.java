package com.tmploeg.chatapp.chat;

import com.tmploeg.chatapp.users.User;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ChatMessageService {
  private final ChatMessageRepository chatMessageRepository;

  public ChatMessage save(String message, User sender) {
    return chatMessageRepository.save(new ChatMessage(message, sender));
  }
}
