import { Nav } from "react-bootstrap";
import { useApi, useAppNavigate, useAuth } from "../../hooks";
import "./ChatMenu.scss";
import { useEffect, useState } from "react";
import ChatGroup from "../../models/chat-group";
import ApiRoute from "../../enums/ApiRoute";
import { ClipLoader } from "react-spinners";
import { BsPeopleFill, BsPersonFill } from "react-icons/bs";
import { IconBaseProps } from "react-icons";
import AppRoute from "../../enums/AppRoute";

const NAV_ICON_SIZE = 30;

export default function ChatMenu() {
  const [chatGroups, setChatGroups] = useState<ChatGroup[]>();

  const { get } = useApi();
  const navigate = useAppNavigate();
  const { getUsername } = useAuth();

  useEffect(() => {
    get<ChatGroup[]>(ApiRoute.CHAT_GROUPS()).then(setChatGroups);
  }, []);

  return (
    <div className="chat-menu">
      {chatGroups ? (
        chatGroups.length > 0 ? (
          <Nav>
            {chatGroups.map((group) => (
              <Nav.Item
                key={group.id}
                onClick={() => navigate(AppRoute.CHAT(group.id))}
              >
                <GroupIcon group={group} size={NAV_ICON_SIZE} />
                <div className="nav-item-text">
                  <span>{getGroupTitle(group)}</span>
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

  function getGroupTitle(group: ChatGroup) {
    if (group.users.length > 2) {
      return group.name;
    }

    return group.users[0].username === getUsername()
      ? group.users[1].username
      : group.users[0].username;
  }
}

interface GroupIconProps extends IconBaseProps {
  group: ChatGroup;
}
function GroupIcon({ group }: GroupIconProps) {
  if (group.users.length > 2) {
    return <BsPeopleFill size={NAV_ICON_SIZE} />;
  }

  return <BsPersonFill size={NAV_ICON_SIZE} />;
}
