package com.tmploeg.chatapp.security;

import com.tmploeg.chatapp.users.User;
import java.util.function.Supplier;

public interface AuthenticationProvider extends Supplier<User> {}
