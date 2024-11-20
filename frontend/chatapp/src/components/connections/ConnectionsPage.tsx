import { Button } from "react-bootstrap";
import PageTitle from "../page/title/PageTitle";
import BadgeNotification from "../generic/badge-notification/BadgeNotification";
import "./ConnectionsPage.scss";
import { useAppNavigate } from "../../hooks";
import AppRoute from "../../enums/AppRoute";

interface Props {
  hasNewRequests?: boolean;
  onNewRequestsChecked?: () => void;
}
export default function ConnectionsPage({
  hasNewRequests,
  onNewRequestsChecked,
}: Props) {
  const navigate = useAppNavigate();
  return (
    <div className="connections-page">
      <PageTitle text="Connections">
        <div className="connection-requests-button-container">
          <Button
            variant="outline-primary"
            onClick={() => {
              onNewRequestsChecked?.();
              navigate(AppRoute.CONNECTION_REQUESTS);
            }}
          >
            Connection Requests
          </Button>
          {hasNewRequests && <BadgeNotification />}
        </div>
      </PageTitle>
    </div>
  );
}
