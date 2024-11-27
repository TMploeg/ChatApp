import { IconType } from "react-icons";
import "./IconButton.scss";

interface Props {
  Icon: IconType;
  size?: Size;
  onClick?: () => void;
}
export default function IconButton({ Icon, size, onClick }: Props) {
  return (
    <div className="icon-button" onClick={onClick}>
      <Icon size={getIconSize(size ?? Size.MEDIUM)} />
      <div className="overlay" />
    </div>
  );
}

function getIconSize(size: Size): number {
  switch (size) {
    case Size.SMALL:
      return 20;
    case Size.MEDIUM:
      return 28;
    case Size.LARGE:
      return 40;
    default:
      throw new Error("unhandled size case");
  }
}

export enum Size {
  SMALL,
  MEDIUM,
  LARGE,
}
