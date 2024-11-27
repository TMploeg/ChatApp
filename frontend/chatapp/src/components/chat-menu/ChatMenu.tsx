import { Button, Nav } from "react-bootstrap";
import { useApi, useAppNavigate } from "../../hooks";
import "./ChatMenu.scss";
import { useContext, useEffect, useState } from "react";
import ChatGroup, { ChatGroupData } from "../../models/chat-group";
import ApiRoute from "../../enums/ApiRoute";
import { ClipLoader } from "react-spinners";
import { BsPeopleFill, BsPersonFill, BsPlusLg } from "react-icons/bs";
import { IconBaseProps } from "react-icons";
import AppRoute from "../../enums/AppRoute";
import AppContext from "../../AppContext";
import IconButton, { Size } from "../generic/icon-button/IconButton";
import AddGroupChatDialog from "./add-group-chat-dialog/AddGroupChatDialog";

const NAV_ICON_SIZE = 30;

export default function ChatMenu() {
  const [chatGroups, setChatGroups] = useState<ChatGroup[]>();

  const [addGroupChatDialogVisible, setAddGroupChatDialogVisible] =
    useState<boolean>(false);

  const { get } = useApi();
  const navigate = useAppNavigate();

  const { subscriptions } = useContext(AppContext);

  useEffect(() => {
    get<ChatGroupData[]>(ApiRoute.CHAT_GROUPS()).then((groups) =>
      setChatGroups(groups.map((group) => new ChatGroup(group)))
    );

    subscriptions.chatGroups.subscribe("ChatMenu", (newGroup) =>
      addChatGroup(new ChatGroup(newGroup))
    );
  }, []);

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
            addChatGroup(group);
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
