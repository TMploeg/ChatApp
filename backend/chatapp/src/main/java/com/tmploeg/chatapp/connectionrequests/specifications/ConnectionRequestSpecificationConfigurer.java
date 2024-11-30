package com.tmploeg.chatapp.connectionrequests.specifications;

import com.tmploeg.chatapp.connectionrequests.ConnectionRequestDirection;
import com.tmploeg.chatapp.connectionrequests.ConnectionRequestState;
import com.tmploeg.chatapp.users.User;
import java.util.Collection;
import java.util.UUID;

public interface ConnectionRequestSpecificationConfigurer {
  void hasId(UUID id);

  void hasUser(UserSpecificationData... userSpecificationData);

  void hasUser(User user, ConnectionRequestDirection direction);

  void inState(ConnectionRequestState state);

  void inState(Collection<ConnectionRequestState> states);
}