export default class StompBroker {
  public static readonly CHAT = (group: string) =>
    new StompBroker(`/queue/chat/${group}`);
  public static readonly SEND_CONNECTION_REQUESTS = new StompBroker(
    "/user/queue/connection-requests/send"
  );
  public static readonly ANSWERED_CONNECTION_REQUESTS = new StompBroker(
    "/user/queue/connection-requests/answered"
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
