export default class ApiRoute {
  public static readonly CHAT = () => new ApiRoute(Route.CHAT);
  public static readonly LOGIN = () => new ApiRoute(Route.LOGIN);
  public static readonly REGISTER = () => new ApiRoute(Route.REGISTER);
  public static readonly CHECKIN = () => new ApiRoute(Route.CHECKIN);
  public static readonly CONNECTION_REQUESTS = () =>
    new ApiRoute(Route.CONNECTION_REQUESTS);
  public static readonly SINGLE_CONNECTION_REQUEST = (id: string) =>
    new ApiRoute(`${Route.CONNECTION_REQUESTS}/${id}`);
  public static readonly CONNECTIONS = () => new ApiRoute(Route.CONNECTIONS);

  public readonly destination: string;

  private constructor(destination: string) {
    this.destination = destination;
  }
}

enum Route {
  CHAT = "/chat",
  LOGIN = "/auth/login",
  REGISTER = "/auth/register",
  CHECKIN = "/checkin",
  CONNECTION_REQUESTS = "/connectionrequests",
  CONNECTIONS = "/connections",
}
