import { Nav } from "react-bootstrap";
import { BsBoxArrowRight, BsGlobe, BsHouseFill } from "react-icons/bs";
import { useAppNavigate, useStorage } from "../../hooks";
import AppRoute from "../../enums/AppRoute";
import "./NavMenu.scss";
import { StorageLocation } from "../../enums/StorageLocation";

const NAV_ICON_SIZE = 45;
export default function NavMenu() {
  const navigate = useAppNavigate();
  const { set: setToken } = useStorage(StorageLocation.JWT);

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
