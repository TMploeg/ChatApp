package com.tmploeg.chatapp.connectionrequests;

import java.util.Optional;
import java.util.Set;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ConnectionRequestRepository extends JpaRepository<ConnectionRequest, UUID> {
  @Query(
      "SELECT COUNT(cR) > 0 "
          + "FROM ConnectionRequest cR "
          + "WHERE cR.connector.username = :connector AND cR.connectee.username = :connectee")
  boolean connectionRequestExists(
      @Param("connector") String connectorUsername, @Param("connectee") String connecteeUsername);

  @Query(
      "SELECT cR "
          + "FROM ConnectionRequest cR "
          + "WHERE (cR.connector.username = :username OR cR.connectee.username = :username) AND cR.id = :id")
  Optional<ConnectionRequest> getRequestByIdForUser(
      @Param("id") UUID id, @Param("username") String username);

  Set<ConnectionRequest> findByConnectee_username(String username);

  Set<ConnectionRequest> findByConnectee_usernameAndState(
      String username, ConnectionRequestState state);
}