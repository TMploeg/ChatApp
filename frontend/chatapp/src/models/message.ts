export default interface Message {
  content: string;
  sender: string;
  sendAt: SendAt;
}

export interface SendAt {
  date: string;
  time: string;
}

export interface NewMessage {
  content: string;
}
