package com.tmploeg.chatapp.chat;

import com.tmploeg.chatapp.chat.chatgroup.ChatGroup;
import com.tmploeg.chatapp.users.User;
import java.util.Set;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ChatMessageRepository extends JpaRepository<ChatMessage, UUID> {
  @Query(
      "SELECT cM FROM ChatMessage cM "
          + "WHERE cM.group = :group "
          + "AND :user MEMBER OF cM.group.users "
          + "ORDER BY cM.sendAt DESC")
  Set<ChatMessage> getChatGroupHistory(@Param("group") ChatGroup group, @Param("user") User user);
}
