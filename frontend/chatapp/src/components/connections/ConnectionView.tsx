import { BsPersonFill } from "react-icons/bs";
import Connection from "../../models/connection";

interface Props {
  connection: Connection;
}
export default function ConnectionView({ connection }: Props) {
  return (
    <div className="connection">
      <div className="connection-image">
        <BsPersonFill size={50} />
      </div>
      <div>
        <h2 className="connection-username">{connection.username}</h2>
      </div>
    </div>
  );
}
