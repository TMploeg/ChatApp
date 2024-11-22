import User from "./user";

export default interface ChatGroup {
  id: string;
  name: string;
  users: User[];
}
