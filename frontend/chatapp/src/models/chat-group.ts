import User from "./user";

export default class ChatGroup {
  private readonly id: string;
  private readonly users: User[];
  private readonly closed: boolean;
  private name?: string;

  public static from(data: ChatGroupData): ChatGroup {
    return new ChatGroup(data.id, data.users, data.closed, data.name);
  }

  public static closed(data: ClosedChatGroupData) {
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

  public getName(): string | undefined {
    if (this.closed) {
      return this.users[0].username;
    }

    return this.name;
  }

  public setName(name: string): void {
    this.name = name;
  }

  public isClosed(): boolean {
    return this.closed;
  }

  public getUsersDisplayData(): UsersDisplayData {
    const maxDisplayCount = 2;

    return {
      users: this.users.slice(0, maxDisplayCount),
      remaining: this.users.length - maxDisplayCount,
    };
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

export interface UsersDisplayData {
  users: User[];
  remaining: number;
}
