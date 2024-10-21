import { Button } from "react-bootstrap";
import "./Toolbar.scss";

interface Props {
  title?: string;
  onLogout?: () => void;
}
export default function Toolbar({ title, onLogout }: Props) {
  return (
    <div className="toolbar">
      <div>{title && <span className="toolbar-title">{title}</span>}</div>
      <div>{onLogout && <Button onClick={onLogout}>Logout</Button>}</div>
    </div>
  );
}
