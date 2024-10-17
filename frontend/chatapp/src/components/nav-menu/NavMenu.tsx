import { Nav } from "react-bootstrap";
import "./NavMenu.scss";
import { BsGlobe, BsHouseFill } from "react-icons/bs";

const NAV_ICON_SIZE = 45;
export default function NavMenu() {
  return (
    <div className="nav-menu">
      <Nav>
        <Nav.Item>
          <BsHouseFill size={NAV_ICON_SIZE} />
          <span>Home</span>
        </Nav.Item>
        <Nav.Item>
          <BsGlobe size={NAV_ICON_SIZE} />
          <span>Global Chat</span>
        </Nav.Item>
      </Nav>
    </div>
  );
}
