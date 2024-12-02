export default class ApiRoute {
  public static readonly CHAT = () => new ApiRoute(Route.CHAT);
  public static readonly LOGIN = () => new ApiRoute(Route.LOGIN);
  public static readonly REGISTER = () => new ApiRoute(Route.REGISTER);
  public static readonly CONNECTION_REQUESTS = () =>
    new ApiRoute(Route.CONNECTION_REQUESTS);
  public static readonly SINGLE_CONNECTION_REQUEST = (id: string) =>
    new ApiRoute(`${Route.CONNECTION_REQUESTS}/${id}`);
  public static readonly CONNECTIONS = () => new ApiRoute(Route.CONNECTIONS);
  public static readonly CHAT_GROUPS = () => new ApiRoute(Route.CHAT_GROUPS);
  public static readonly CLOSED_CHAT_GROUPS = () =>
    new ApiRoute(Route.CHAT_GROUPS + "/closed");

  public readonly destination: string;

  private constructor(destination: string) {
    this.destination = destination;
  }
}

enum Route {
  CHAT = "/chat",
  LOGIN = "/auth/login",
  REGISTER = "/auth/register",
  CONNECTION_REQUESTS = "/connectionrequests",
  CONNECTIONS = "/connections",
  CHAT_GROUPS = "/chatgroups",
}
