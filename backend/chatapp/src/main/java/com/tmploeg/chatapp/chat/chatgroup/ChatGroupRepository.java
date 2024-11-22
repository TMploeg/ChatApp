package com.tmploeg.chatapp.chat.chatgroup;

import com.tmploeg.chatapp.users.User;
import java.util.Set;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ChatGroupRepository extends JpaRepository<ChatGroup, UUID> {
  @Query(
      "SELECT cG FROM ChatGroup cG "
          + "WHERE :user MEMBER OF cG.users "
          + "ORDER BY (SELECT MAX(cM.sendAt) FROM ChatMessage cM WHERE cM.group = cG)")
  Set<ChatGroup> findChatGroupsForUser(@Param("user") User user);
}
