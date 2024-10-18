package com.tmploeg.chatapp.chat;

import java.time.LocalDate;
import java.time.LocalDateTime;

public record SendAtDTO(String date, String time) {
  public static SendAtDTO from(LocalDateTime sendAt) {
    String sendDate = LocalDate.from(sendAt).toString();

    String sendTime =
        sendAt.getHour() + ":" + (sendAt.getMinute() < 10 ? "0" : "") + sendAt.getMinute();

    return new SendAtDTO(sendDate, sendTime);
  }
}
