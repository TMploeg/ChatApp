import axios from "axios";
import ApiRoute from "../enums/ApiRoute";
import useToken from "./useToken";

export default function useApi() {
  const getToken = useToken();

  function get<TResponse>(
    destination: ApiRoute,
    params?: any
  ): Promise<TResponse> {
    return axios
      .get<TResponse>(getFullRoute(destination), {
        params,
        headers: getHeaders(),
      })
      .then((response) => response.data);
  }

  function post<TResponse>(
    destination: ApiRoute,
    body: any,
    params?: any
  ): Promise<TResponse> {
    return axios
      .post<TResponse>(getFullRoute(destination), body, {
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

  function getFullRoute(route: string): string {
    return import.meta.env.VITE_API_URL + route;
  }

  return {
    get,
    post,
  };
}
