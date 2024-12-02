import { BsPersonFill } from "react-icons/bs";
import User from "../../../models/user";
import SeperatedList from "../../generic/seperated-list/SeperatedList";
import "./GroupUsersDropdown.scss";
import { useRef } from "react";

interface Props {
  visible: boolean;
  users: User[];
}
export default function GroupUsersDropdown({ visible, users }: Props) {
  const dropdownRef = useRef<HTMLDivElement>(null);
  if (!visible) {
    return <></>;
  }

  return (
    <div className="group-users-dropdown" ref={dropdownRef}>
      <SeperatedList
        items={users.map((user) => ({ ...user, id: user.username }))}
        ItemRenderElement={({ item: user }) => (
          <div className="user-display">
            <BsPersonFill size="1.8em" />
            <div className="user-display-username">{user.username}</div>
          </div>
        )}
      />
    </div>
  );
}
