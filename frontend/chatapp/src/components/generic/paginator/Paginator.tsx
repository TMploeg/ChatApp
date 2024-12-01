import { BsChevronLeft, BsChevronRight } from "react-icons/bs";
import "./Paginator.scss";

export interface PaginatorProps {
  page: number;
  totalPages: number;
  onPrevious: () => void;
  onNext: () => void;
}
export default function Paginator({
  page,
  totalPages,
  onNext,
  onPrevious,
}: PaginatorProps) {
  const pageNr = page + 1;

  return (
    <div className="paginator">
      <PaginatorButton disabled={pageNr <= 1} onClick={onPrevious}>
        <BsChevronLeft />
      </PaginatorButton>
      <span>
        {pageNr} / {totalPages}
      </span>
      <PaginatorButton disabled={pageNr >= totalPages} onClick={onNext}>
        <BsChevronRight />
      </PaginatorButton>
    </div>
  );
}

interface PaginatorButtonProps {
  children: any;
  disabled?: boolean;
  onClick?: () => void;
}
function PaginatorButton({
  children,
  disabled,
  onClick,
}: PaginatorButtonProps) {
  return (
    <div
      className={`paginator-button ${disabled ? "disabled" : ""}`}
      onClick={handleClicked}
    >
      {children}
    </div>
  );

  function handleClicked() {
    if (disabled) {
      return;
    }

    onClick?.();
  }
}
