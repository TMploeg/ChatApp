import { Nav } from "react-bootstrap";
import "./NavMenu.scss";
import { BsGlobe, BsHouseFill } from "react-icons/bs";
import { useAppNavigate } from "../../hooks";
import AppRoute from "../../enums/AppRoute";

const NAV_ICON_SIZE = 45;
export default function NavMenu() {
  const navigate = useAppNavigate();

  return (
    <div className="nav-menu">
      <Nav>
        <Nav.Item onClick={() => navigate(AppRoute.HOME)}>
          <BsHouseFill size={NAV_ICON_SIZE} />
          <span>Home</span>
        </Nav.Item>
        <Nav.Item onClick={() => navigate(AppRoute.GLOBAL_CHAT)}>
          <BsGlobe size={NAV_ICON_SIZE} />
          <span>Global Chat</span>
        </Nav.Item>
      </Nav>
    </div>
  );
}
