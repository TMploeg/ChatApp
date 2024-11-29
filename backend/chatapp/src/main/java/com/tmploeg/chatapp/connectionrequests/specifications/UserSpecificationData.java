package com.tmploeg.chatapp.connectionrequests.specifications;

import com.tmploeg.chatapp.connectionrequests.ConnectionRequestDirection;
import com.tmploeg.chatapp.users.User;

public record UserSpecificationData(User user, ConnectionRequestDirection direction) {}
