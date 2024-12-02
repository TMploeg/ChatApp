import User from "./user";

export default class ChatGroup {
  private readonly id: string;
  private readonly users: User[];
  private readonly closed: boolean;
  private readonly name?: string;

  public static from(data: ChatGroupData): ChatGroup {
    console.log(data);
    return new ChatGroup(data.id, data.users, data.closed, data.name);
  }

  public static closed(data: ClosedChatGroupData) {
    console.log(data);
    return new ChatGroup(data.id, [data.subject], true);
  }

  private constructor(
    id: string,
    users: User[],
    closed: boolean,
    name?: string
  ) {
    this.id = id;
    this.users = users;
    this.closed = closed;
    this.name = name;
  }

  public getId(): string {
    return this.id;
  }

  public getUsers(): User[] {
    return this.users;
  }

  public getName(): string {
    if (this.closed) {
      return this.users[0].username;
    }

    return this.name ?? this.getPlaceholderGroupName();
  }

  public getClosed(): boolean {
    return this.closed;
  }

  private getPlaceholderGroupName(): string {
    console.log("ID", this.id);
    const maxDisplayCount = 2;

    let name = this.users
      .slice(0, maxDisplayCount)
      .map((user) => user.username)
      .join(", ");

    const rem = this.users.length - maxDisplayCount;
    if (rem > 0) {
      name += ` and ${rem} other users`;
    }

    return name;
  }
}

export interface ChatGroupData {
  id: string;
  users: User[];
  name?: string;
  closed: boolean;
}

export interface ClosedChatGroupData {
  id: string;
  subject: User;
}
