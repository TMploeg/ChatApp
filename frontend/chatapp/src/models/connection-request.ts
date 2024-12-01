export default interface ConnectionRequest {
  id: string;
  subject: string;
}

export interface SendConnectionRequest extends ConnectionRequest {
  seen: boolean;
}

export interface AnsweredConnectionRequest extends ConnectionRequest {
  accepted: boolean;
}
