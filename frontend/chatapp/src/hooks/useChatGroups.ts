import ApiRoute from "../enums/ApiRoute";
import ChatGroup, { ChatGroupData } from "../models/chat-group";
import useApi from "./useApi";

export default function useChatGroups() {
  const { post } = useApi();

  function createPrivateGroup(username: string): Promise<ChatGroup> {
    return post<ChatGroupData>(ApiRoute.CHAT_GROUPS(), {
      usernames: [username],
      mutable: false,
    }).then((createdGroup) => new ChatGroup(createdGroup));
  }

  function createMultiGroup(
    usernames: string[],
    name?: string
  ): Promise<ChatGroup> {
    return post<ChatGroupData>(ApiRoute.CHAT_GROUPS(), {
      usernames,
      mutable: true,
      name,
    }).then((group) => new ChatGroup(group));
  }

  return { createPrivateGroup, createMultiGroup };
}
