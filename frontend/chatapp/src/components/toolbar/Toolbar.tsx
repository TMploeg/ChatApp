import { Button, OverlayTrigger, Tooltip } from "react-bootstrap";
import "./Toolbar.scss";
import { BsBoxArrowRight, BsEnvelopeFill, BsPeopleFill } from "react-icons/bs";
import { useAppNavigate } from "../../hooks";
import AppRoute from "../../enums/AppRoute";
import Connections from "../connections/Connections";
import { useState } from "react";
import ConnectionRequests from "../connection-requests/ConnectionRequests";

interface Props {
  title?: string;
  loggedIn: boolean;
  onLogout: () => void;
}
export default function Toolbar({ title, loggedIn, onLogout }: Props) {
  const navigate = useAppNavigate();

  const [backdropVisiblity, setBackdropVisiblity] = useState<BackdropVisiblity>(
    { connections: false, connectionRequests: false }
  );

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
                onClick={() =>
                  setBackdropVisiblity((visibility) => ({
                    ...visibility,
                    connections: true,
                  }))
                }
                className="toolbar-button"
              >
                <BsPeopleFill size={32} />
              </Button>
            </OverlayTrigger>
            <OverlayTrigger
              placement="bottom"
              overlay={<Tooltip>Connection Requests</Tooltip>}
              delay={500}
            >
              <Button
                onClick={() =>
                  setBackdropVisiblity((visibility) => ({
                    ...visibility,
                    connectionRequests: true,
                  }))
                }
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
            <Connections
              show={backdropVisiblity.connections}
              onHide={() =>
                setBackdropVisiblity((visibility) => ({
                  ...visibility,
                  connections: false,
                }))
              }
            />
            <ConnectionRequests
              show={backdropVisiblity.connectionRequests}
              onHide={() =>
                setBackdropVisiblity((visibility) => ({
                  ...visibility,
                  connectionRequests: false,
                }))
              }
            />
          </>
        )}
      </div>
    </div>
  );
}

interface BackdropVisiblity {
  connections: boolean;
  connectionRequests: boolean;
}
