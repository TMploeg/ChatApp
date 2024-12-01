package com.tmploeg.chatapp.messaging;

import com.tmploeg.chatapp.chat.chatgroup.ChatGroupService;
import java.util.Optional;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class SubscribeHandler {
  private final ChatGroupService chatGroupService;

  public boolean isValidSubscription(StompHeaderAccessor accessor) {
    if (accessor.getDestination() == null) {
      return false;
    }

    if (accessor.getDestination().startsWith(Broker.CHAT.getDestination())) {
      String username = getUsernameFromAccessor(accessor).orElse(null);
      if (username == null) {
        return false;
      }

      return isValidChatSubscription(accessor.getDestination(), username);
    }

    return true;
  }

  private boolean isValidChatSubscription(String subscriptionDestination, String username) {
    UUID chatGroupId = getChatGroupIdFromDestination(subscriptionDestination).orElse(null);
    if (chatGroupId == null) {
      return false;
    }

    return chatGroupService.existsByIdForUser(chatGroupId, username);
  }

  private static Optional<UUID> getChatGroupIdFromDestination(String destination) {
    if (destination == null) {
      return Optional.empty();
    }

    String chatDestination = Broker.CHAT.getDestination() + "/";
    if (!destination.startsWith(chatDestination)) {
      return Optional.empty();
    }

    try {
      return Optional.of(UUID.fromString(destination.substring(chatDestination.length())));
    } catch (IllegalArgumentException ignored) {
      return Optional.empty();
    }
  }

  private Optional<String> getUsernameFromAccessor(StompHeaderAccessor accessor) {
    if (accessor.getUser() == null) {
      return Optional.empty();
    }

    return Optional.ofNullable(accessor.getUser().getName());
  }
}
