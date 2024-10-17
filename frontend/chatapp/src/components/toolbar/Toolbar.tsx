import "./Toolbar.scss";

interface Props {
  title?: string;
}
export default function Toolbar({ title }: Props) {
  return (
    <div className="toolbar">
      <div className="toolbar-start">
        {title && <span className="toolbar-title">{title}</span>}
      </div>
    </div>
  );
}
