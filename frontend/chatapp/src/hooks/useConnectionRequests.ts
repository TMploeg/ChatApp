import ApiRoute from "../enums/ApiRoute";
import ConnectionRequestAnswerType from "../enums/ConnectionRequestAnswerType";
import { SendConnectionRequest } from "../models/connection-request";
import useApi from "./useApi";

export default function useConnectionRequests() {
  const { patch } = useApi();

  function markRequestSeen(request: SendConnectionRequest) {
    return patch<void>(ApiRoute.SINGLE_CONNECTION_REQUEST(request.id), {
      state: "SEEN",
    });
  }

  function answerRequest(
    request: SendConnectionRequest,
    answerType: ConnectionRequestAnswerType
  ) {
    return patch<void>(ApiRoute.SINGLE_CONNECTION_REQUEST(request.id), {
      state: answerType,
    });
  }

  return {
    markRequestSeen,
    answerRequest,
  };
}
