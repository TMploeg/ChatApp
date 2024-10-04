package com.tmploeg.chatapp.chat;

public record ChatMessageDTO(String message, String sender) {
  public static ChatMessageDTO from(ChatMessage message) {
    return new ChatMessageDTO(message.getContent(), message.getSender().getUsername());
  }
}
