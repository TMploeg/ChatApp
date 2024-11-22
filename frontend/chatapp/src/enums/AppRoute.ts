export default class AppRoute {
  public static readonly HOME = new AppRoute("/");
  public static readonly CHAT = (groupId: string) =>
    new AppRoute("/chat/" + groupId);
  public static readonly LOGIN = new AppRoute("/login");
  public static readonly REGISTER = new AppRoute("/register");
  public static readonly CONNECTIONS = new AppRoute("/connections");
  public static readonly CONNECTION_REQUESTS = new AppRoute(
    "/connection-requests"
  );
  public static readonly ANY = new AppRoute("/*");

  public readonly value: string;
  constructor(value: string) {
    this.value = value;
  }
}
