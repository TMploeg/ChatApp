import { Nav } from "react-bootstrap";
import { BsGlobe, BsHouseFill, BsFillPeopleFill } from "react-icons/bs";
import { useAppNavigate } from "../../hooks";
import AppRoute from "../../enums/AppRoute";
import "./NavMenu.scss";
import BadgeNotification from "../generic/badge-notification/BadgeNotification";

const NAV_ICON_SIZE = 45;

enum NavLocation {
  HOME = "home",
  GLOBAL_CHAT = "globalChat",
  CONNECTIONS = "connections",
}
interface Props {
  notifications?: {
    [key in NavLocation]?: boolean;
  };
}
export default function NavMenu({ notifications }: Props) {
  const navigate = useAppNavigate();

  return (
    <div className="nav-menu">
      <Nav>
        <Nav.Item onClick={() => navigate(AppRoute.HOME)}>
          <BsHouseFill size={NAV_ICON_SIZE} />
          <div className="nav-item-text">
            <span>Home</span>
            {notifications?.home === true && <BadgeNotification />}
          </div>
        </Nav.Item>
        <Nav.Item onClick={() => navigate(AppRoute.GLOBAL_CHAT)}>
          <BsGlobe size={NAV_ICON_SIZE} />
          <div className="nav-item-text">
            <span>Global Chat</span>
            {notifications?.globalChat === true && <BadgeNotification />}
          </div>
        </Nav.Item>
        <Nav.Item onClick={() => navigate(AppRoute.CONNECTIONS)}>
          <BsFillPeopleFill size={NAV_ICON_SIZE} />
          <div className="nav-item-text">
            <span>Connections</span>
            {notifications?.connections === true && <BadgeNotification />}
          </div>
        </Nav.Item>
      </Nav>
    </div>
  );
}
