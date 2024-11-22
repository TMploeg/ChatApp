import { Button, OverlayTrigger, Tooltip } from "react-bootstrap";
import "./Toolbar.scss";
import { BsBoxArrowRight, BsFillPeopleFill } from "react-icons/bs";
import { useAppNavigate } from "../../hooks";
import AppRoute from "../../enums/AppRoute";

interface Props {
  title?: string;
  loggedIn: boolean;
  onLogout: () => void;
}
export default function Toolbar({ title, loggedIn, onLogout }: Props) {
  const navigate = useAppNavigate();

  return (
    <div className="toolbar">
      <div>
        {title && (
          <span
            className="toolbar-title"
            onClick={() => navigate(AppRoute.HOME)}
          >
            {title}
          </span>
        )}
      </div>
      <div>
        {loggedIn && (
          <>
            <OverlayTrigger
              placement="bottom"
              overlay={<Tooltip>Connections</Tooltip>}
              delay={500}
            >
              <Button
                onClick={() => navigate(AppRoute.CONNECTIONS)}
                className="toolbar-button"
              >
                <BsFillPeopleFill size={32} />
              </Button>
            </OverlayTrigger>
            <OverlayTrigger
              placement="bottom"
              overlay={<Tooltip>Logout</Tooltip>}
              delay={500}
            >
              <Button onClick={onLogout} className="toolbar-button">
                <BsBoxArrowRight size={32} />
              </Button>
            </OverlayTrigger>
          </>
        )}
      </div>
    </div>
  );
}
