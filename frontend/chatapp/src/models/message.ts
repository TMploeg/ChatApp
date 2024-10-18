export default interface Message {
  content: string;
  sender: string;
  sendAt: SendAt;
}

interface SendAt {
  date: string;
  time: string;
}
