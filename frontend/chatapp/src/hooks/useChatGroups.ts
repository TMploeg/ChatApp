import ApiRoute from "../enums/ApiRoute";
import ChatGroup, {
  ChatGroupData,
  ClosedChatGroupData,
} from "../models/chat-group";
import Connection from "../models/connection";
import useApi from "./useApi";

export default function useChatGroups() {
  const { get, post } = useApi();

  async function findClosedGroupForConnection(
    connection: Connection
  ): Promise<ChatGroup | null> {
    const groups = await get<ClosedChatGroupData[]>(
      ApiRoute.CLOSED_CHAT_GROUPS()
    );

    for (let group of groups) {
      if (group.subject.username === connection.username) {
        return ChatGroup.closed(group);
      }
    }

    return null;
  }

  function createClosedGroup(username: string): Promise<ChatGroup> {
    return post<ChatGroupData>(ApiRoute.CHAT_GROUPS(), {
      usernames: [username],
      closed: true,
    }).then((createdGroup) => ChatGroup.from(createdGroup));
  }

  function createMultiGroup(
    usernames: string[],
    name?: string
  ): Promise<ChatGroup> {
    return post<ChatGroupData>(ApiRoute.CHAT_GROUPS(), {
      usernames,
      name,
      closed: false,
    }).then((group) => ChatGroup.from(group));
  }

  return { findClosedGroupForConnection, createClosedGroup, createMultiGroup };
}
