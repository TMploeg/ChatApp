import ApiRoute from "../enums/ApiRoute";
import ChatGroup, {
  ChatGroupData,
  ClosedChatGroupData,
} from "../models/chat-group";
import Connection from "../models/connection";
import useApi from "./useApi";

export default function useChatGroups() {
  const { get, post, patch } = useApi();

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

  function getById(id: string): Promise<ChatGroup> {
    return get<ChatGroupData>(ApiRoute.SINGLE_CHAT_GROUP(id)).then(
      ChatGroup.from
    );
  }

  function changeName(
    chatGroup: ChatGroup,
    newName: string
  ): Promise<ChatGroup> {
    return patch<ChatGroupData>(ApiRoute.SINGLE_CHAT_GROUP(chatGroup.getId()), {
      name: newName,
    }).then((data) => ChatGroup.from(data));
  }

  return {
    findClosedGroupForConnection,
    createClosedGroup,
    createMultiGroup,
    getById,
    changeName,
  };
}
