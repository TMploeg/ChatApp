import { ReactNode } from "react";
import "./PageTitle.scss";

type ChildrenAlignment = "start" | "end" | "space-around" | "space-between";
const DEFAULT_CHILDREN_ALIGNMENT: ChildrenAlignment = "end";
interface Props {
  text: string;
  children?: ReactNode;
  alignChildren?: ChildrenAlignment;
}
export default function PageTitle({ text, children, alignChildren }: Props) {
  return (
    <div className="page-title">
      <div className="page-title-text">{text}</div>
      {children && (
        <div
          className={`page-title-children ${
            alignChildren ? alignChildren : DEFAULT_CHILDREN_ALIGNMENT
          }`}
        >
          {children}
        </div>
      )}
    </div>
  );
}
