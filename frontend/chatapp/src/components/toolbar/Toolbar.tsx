import { Button, OverlayTrigger, Tooltip } from "react-bootstrap";
import "./Toolbar.scss";
import { BsBoxArrowRight, BsEnvelopeFill, BsPeopleFill } from "react-icons/bs";
import { useAppNavigate } from "../../hooks";
import AppRoute from "../../enums/AppRoute";

interface Props {
  title?: string;
  loggedIn: boolean;
  onLogout: () => void;
  onShowConnections: () => void;
  onShowConnectionRequests: () => void;
}
export default function Toolbar({
  title,
  loggedIn,
  onLogout,
  onShowConnections,
  onShowConnectionRequests,
}: Props) {
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
              <Button onClick={onShowConnections} className="toolbar-button">
                <BsPeopleFill size={32} />
              </Button>
            </OverlayTrigger>
            <OverlayTrigger
              placement="bottom"
              overlay={<Tooltip>Connection Requests</Tooltip>}
              delay={500}
            >
              <Button
                onClick={onShowConnectionRequests}
                className="toolbar-button"
              >
                <BsEnvelopeFill size={32} />
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
