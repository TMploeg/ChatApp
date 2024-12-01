export default class StompBroker {
  public static readonly CHAT = (group: string) =>
    new StompBroker(`/queue/chat/${group}`);
  public static readonly CONNECTION_REQUESTS = new StompBroker(
    "/user/queue/connection-requests"
  );
  public static readonly CHAT_GROUPS = new StompBroker(
    "/user/queue/chatgroups"
  );

  private path: string;
  private constructor(path: string) {
    this.path = path;
  }

  public getPath(): string {
    return this.path;
  }
}
