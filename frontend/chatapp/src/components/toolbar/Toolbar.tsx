import { Button, OverlayTrigger, Tooltip } from "react-bootstrap";
import "./Toolbar.scss";
import { BsBoxArrowRight } from "react-icons/bs";

interface Props {
  title?: string;
  loggedIn: boolean;
  onLogout: () => void;
}
export default function Toolbar({ title, loggedIn, onLogout }: Props) {
  return (
    <div className="toolbar">
      <div>{title && <span className="toolbar-title">{title}</span>}</div>
      <div>
        {loggedIn && (
          <OverlayTrigger
            placement="bottom"
            overlay={<Tooltip>Logout</Tooltip>}
            delay={500}
          >
            <Button onClick={onLogout} className="logout-button">
              <BsBoxArrowRight size={32} />
            </Button>
          </OverlayTrigger>
        )}
      </div>
    </div>
  );
}
