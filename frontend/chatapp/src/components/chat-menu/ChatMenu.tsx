import { Nav } from "react-bootstrap";
import { useApi, useAppNavigate } from "../../hooks";
import "./ChatMenu.scss";
import { useContext, useEffect, useState } from "react";
import ChatGroup, { ChatGroupData } from "../../models/chat-group";
import ApiRoute from "../../enums/ApiRoute";
import { ClipLoader } from "react-spinners";
import { BsPeopleFill, BsPersonFill, BsPlusLg } from "react-icons/bs";
import { IconBaseProps } from "react-icons";
import AppRoute from "../../enums/AppRoute";
import IconButton, { Size } from "../generic/icon-button/IconButton";
import AddGroupChatDialog from "./add-group-chat-dialog/AddGroupChatDialog";
import { SubscriptionContext } from "../../context";
import StompBroker from "../../enums/StompBroker";

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

  useEffect(() => {
    if (!connected) {
      return;
    }

    get<ChatGroupData[]>(ApiRoute.CHAT_GROUPS()).then((groups) =>
      setChatGroups(groups.map((group) => ChatGroup.from(group)))
    );

    const subscription = subscriptions.subscribe<ChatGroupData>(
      StompBroker.CHAT_GROUPS,
      (newGroup) => addChatGroup(ChatGroup.from(newGroup))
    );

    return () => subscription.unsubscribe();
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
                  <span>{group.getName()}</span>
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
