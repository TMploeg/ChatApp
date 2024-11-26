import ApiRoute from "../enums/ApiRoute";
import ChatGroup from "../models/chat-group";
import useApi from "./useApi";

export default function useChatGroups() {
  const { post } = useApi();

  function create(usernames: string[], name?: string): Promise<ChatGroup> {
    return post<ChatGroup>(ApiRoute.CHAT_GROUPS(), { usernames, name });
  }

  return { create };
}
