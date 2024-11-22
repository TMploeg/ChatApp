package com.tmploeg.chatapp.chat;

public record ChatMessageDTO(String content, String sender, SendAtDTO sendAt, String groupId) {
  public static ChatMessageDTO from(ChatMessage message) {
    return new ChatMessageDTO(
        message.getContent(),
        message.getSender().getUsername(),
        SendAtDTO.from(message.getSendAt()),
        message.getGroup().getId().toString());
  }
}
