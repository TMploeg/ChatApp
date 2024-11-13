import { useEffect, useState } from "react";
import { Button, Toast } from "react-bootstrap";
import "./Notification.scss";
import NotificationData from "../../models/notification-data";

const NOTIFICATION_AUTOHIDE_DELAY: number = 8000;

interface Props {
  notification: NotificationData;
}
export default function Notification({ notification }: Props) {
  const [visible, setVisible] = useState<boolean>(false);

  useEffect(() => setVisible(true), []);

  return (
    <Toast
      show={visible}
      onClose={() => setVisible(() => false)}
      autohide
      delay={NOTIFICATION_AUTOHIDE_DELAY}
    >
      <Toast.Header>
        <div className="notification-header">
          <notification.icon className="notification-header-icon" />
          <span className="notification-header-title">
            {notification.title}
          </span>
        </div>
      </Toast.Header>
      <Toast.Body>
        <div className="notification-text">{notification.text}</div>
        <div className="notification-actions">
          {notification.actions &&
            Object.keys(notification.actions).map((key) => (
              <Button
                variant={notification.actions![key].type}
                onClick={notification.actions![key].onClick}
              >
                {key}
              </Button>
            ))}
        </div>
      </Toast.Body>
    </Toast>
  );
}
