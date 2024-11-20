export default class ApiRoute {
  public static readonly CHAT: () => ApiRoute = () => new ApiRoute(Route.CHAT);
  public static readonly LOGIN: () => ApiRoute = () =>
    new ApiRoute(Route.LOGIN);
  public static readonly REGISTER: () => ApiRoute = () =>
    new ApiRoute(Route.REGISTER);
  public static readonly CHECKIN: () => ApiRoute = () =>
    new ApiRoute(Route.CHECKIN);
  public static readonly CONNECTION_REQUESTS: () => ApiRoute = () =>
    new ApiRoute(Route.CONNECTION_REQUESTS);
  public static readonly SINGLE_CONNECTION_REQUEST: (id: string) => ApiRoute = (
    id
  ) => new ApiRoute(`${Route.CONNECTION_REQUESTS}/${id}`);

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
}
