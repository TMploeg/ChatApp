interface Props {
  date: string;
}
export default function ChatDateDivider({ date }: Props) {
  return (
    <div className="chat-date-divider">
      <hr />
      <div>{date}</div>
    </div>
  );
}
