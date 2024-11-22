export default interface Message {
  content: string;
  sender: string;
  sendAt: SendAt;
  groupId: string;
}

export interface SendAt {
  date: string;
  time: string;
}

export interface NewMessage {
  content: string;
}
