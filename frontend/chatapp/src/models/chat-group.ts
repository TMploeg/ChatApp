import User from "./user";

export default class ChatGroup {
  private readonly id: string;
  private readonly users: User[];
  private readonly name?: string;

  constructor(data: ChatGroupData) {
    this.id = data.id;
    this.users = data.users;
    this.name = data.name;
  }

  public getId(): string {
    return this.id;
  }

  public getUsers(): User[] {
    return this.users;
  }

  public getName(): string {
    return this.name ?? this.getPlaceholderGroupName();
  }

  private getPlaceholderGroupName(): string {
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
}
