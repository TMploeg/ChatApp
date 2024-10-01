package com.tmploeg.chatapp.chat;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ChatMessageService {
  private final ChatMessageRepository chatMessageRepository;

  public ChatMessage save(String message) {
    return chatMessageRepository.save(new ChatMessage(message));
  }
}
