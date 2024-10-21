package com.tmploeg.chatapp.chat;

public enum ChatHistoryType {
  CONFIRMATION,
  GLOBAL;

  @Override
  public String toString() {
    return name();
  }
}
