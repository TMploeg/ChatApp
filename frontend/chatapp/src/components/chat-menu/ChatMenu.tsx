import { Nav } from "react-bootstrap";
import { useApi, useAppNavigate } from "../../hooks";
import "./ChatMenu.scss";
import { useContext, useEffect, useState } from "react";
import ChatGroup, {
  ChatGroupData,
  UsersDisplayData,
} from "../../models/chat-group";
import ApiRoute from "../../enums/ApiRoute";
import { ClipLoader } from "react-spinners";
import { BsPeopleFill, BsPersonFill, BsPlusLg } from "react-icons/bs";
import { IconBaseProps } from "react-icons";
import AppRoute from "../../enums/AppRoute";
import IconButton, { Size } from "../generic/icon-button/IconButton";
import AddGroupChatDialog from "./add-group-chat-dialog/AddGroupChatDialog";
import { ChangeHandlerContext, SubscriptionContext } from "../../context";
import StompBroker from "../../enums/StompBroker";
import ChangeHandlerName from "../../enums/ChangeHandlerName";
import GroupNameChangedEventData from "../../models/group-name-changed-event-data";

const NAV_ICON_SIZE = 30;

interface Props {
  connected: boolean;
}
export default function ChatMenu({ connected }: Props) {
  const [chatGroups, setChatGroups] = useState<ChatGroup[]>();

  const [addGroupChatDialogVisible, setAddGroupChatDialogVisible] =
    useState<boolean>(false);

  const { get } = useApi();
  const navigate = useAppNavigate();

  const subscriptions = useContext(SubscriptionContext);
  const changeHandlers = useContext(ChangeHandlerContext);

  useEffect(() => {
    if (!connected) {
      return;
    }

    get<ChatGroupData[]>(ApiRoute.CHAT_GROUPS()).then((groups) =>
      setChatGroups(groups.map((group) => ChatGroup.from(group)))
    );

    const chatGroupSubscription = subscriptions.subscribe<ChatGroupData>(
      StompBroker.CHAT_GROUPS,
      (newGroup) => addChatGroup(ChatGroup.from(newGroup))
    );

    const changeHandlerSubscription = changeHandlers.subscribe(
      ChangeHandlerName.CHAT_GROUP_NAME,
      (value) => {
        const data = value as GroupNameChangedEventData;
        updateGroupName(data.groupId, data.newName);
      }
    );

    return () => {
      chatGroupSubscription.unsubscribe();
      changeHandlerSubscription.unsubscribe();
    };
  }, [connected]);

  return (
    <div className="chat-menu">
      <div className="add-group-button-container">
        <IconButton
          Icon={BsPlusLg}
          size={Size.LARGE}
          onClick={() => setAddGroupChatDialogVisible(true)}
        />
        <AddGroupChatDialog
          show={addGroupChatDialogVisible}
          onHide={() => setAddGroupChatDialogVisible(false)}
          onCreated={(group) => {
            navigate(AppRoute.CHAT(group.getId()));
          }}
        />
      </div>
      <hr className="chat-menu-hr" />
      {chatGroups ? (
        chatGroups.length > 0 ? (
          <Nav>
            {chatGroups.map((group) => (
              <Nav.Item
                key={group.getId()}
                onClick={() => navigate(AppRoute.CHAT(group.getId()))}
              >
                <GroupIcon group={group} size={NAV_ICON_SIZE} />
                <div className="nav-item-text">
                  <span>
                    {group.getName() ??
                      getPlaceholderGroupName(group.getUsersDisplayData())}
                  </span>
                </div>
              </Nav.Item>
            ))}
          </Nav>
        ) : (
          <div>No chat groups found {":("}</div>
        )
      ) : (
        <ClipLoader />
      )}
    </div>
  );

  function addChatGroup(group: ChatGroup) {
    setChatGroups((groups) => {
      if (!groups) {
        return undefined;
      }

      groups.unshift(group);
      return groups;
    });
  }

  function getPlaceholderGroupName(usersDisplayData: UsersDisplayData) {
    const usernames = usersDisplayData.users
      .map((user) => user.username)
      .join(", ");
    if (usersDisplayData.remaining <= 0) {
      return usernames;
    }

    return `${usernames} and ${usersDisplayData.remaining} other users`;
  }

  function updateGroupName(groupId: string, newName: string) {
    setChatGroups((groups) => {
      if (!groups) {
        return;
      }

      const targetGroupIndex = groups.findIndex((g) => g.getId() === groupId);
      if (targetGroupIndex < 0) {
        return groups;
      }

      const targetGroup = groups[targetGroupIndex];

      return [
        ...groups.slice(0, targetGroupIndex),
        ChatGroup.from({
          id: targetGroup.getId(),
          users: targetGroup.getUsers(),
          closed: targetGroup.isClosed(),
          name: newName,
        }),
        ...groups.slice(targetGroupIndex + 1),
      ];
    });
  }
}

interface GroupIconProps extends IconBaseProps {
  group: ChatGroup;
}
function GroupIcon({ group }: GroupIconProps) {
  if (group.getUsers().length > 2) {
    return <BsPeopleFill size={NAV_ICON_SIZE} />;
  }

  return <BsPersonFill size={NAV_ICON_SIZE} />;
}
