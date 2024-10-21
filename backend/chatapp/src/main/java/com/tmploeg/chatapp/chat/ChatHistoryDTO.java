package com.tmploeg.chatapp.chat;

import java.util.List;

public record ChatHistoryDTO(ChatHistoryType type, List<ChatMessageDTO> data) {}
