import { Nav } from "react-bootstrap";
import { BsGlobe, BsHouseFill, BsFillPeopleFill } from "react-icons/bs";
import { useAppNavigate } from "../../hooks";
import AppRoute from "../../enums/AppRoute";
import "./NavMenu.scss";

const NAV_ICON_SIZE = 45;

export default function NavMenu() {
  const navigate = useAppNavigate();

  return (
    <div className="nav-menu">
      <Nav>
        <Nav.Item onClick={() => navigate(AppRoute.HOME)}>
          <BsHouseFill size={NAV_ICON_SIZE} />
          <div className="nav-item-text">
            <span>Home</span>
          </div>
        </Nav.Item>
        <Nav.Item onClick={() => navigate(AppRoute.GLOBAL_CHAT)}>
          <BsGlobe size={NAV_ICON_SIZE} />
          <div className="nav-item-text">
            <span>Global Chat</span>
          </div>
        </Nav.Item>
        <Nav.Item onClick={() => navigate(AppRoute.CONNECTIONS)}>
          <BsFillPeopleFill size={NAV_ICON_SIZE} />
          <div className="nav-item-text">
            <span>Connections</span>
          </div>
        </Nav.Item>
      </Nav>
    </div>
  );
}
