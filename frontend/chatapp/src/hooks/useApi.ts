import axios from "axios";
import ApiRoute from "../enums/ApiRoute";
import useToken from "./useToken";

export default function useApi() {
  const getToken = useToken();

  function get<TResponse>(route: ApiRoute, params?: any): Promise<TResponse> {
    return axios
      .get<TResponse>(getFullRoute(route), {
        params,
        headers: getHeaders(),
      })
      .then((response) => response.data);
  }

  function post<TResponse>(
    route: ApiRoute,
    body: any,
    params?: any
  ): Promise<TResponse> {
    return axios
      .post<TResponse>(getFullRoute(route), body, {
        params,
        headers: getHeaders(),
      })
      .then((response) => response.data);
  }

  function patch<TResponse>(
    route: ApiRoute,
    body: any,
    params?: any
  ): Promise<TResponse> {
    return axios
      .patch<TResponse>(getFullRoute(route), body, {
        params,
        headers: getHeaders(),
      })
      .then((response) => response.data);
  }

  function getHeaders() {
    return {
      Authorization: getToken(),
    };
  }

  function getFullRoute(route: ApiRoute): string {
    return import.meta.env.VITE_API_URL + route.destination;
  }

  return {
    get,
    post,
    patch,
  };
}
