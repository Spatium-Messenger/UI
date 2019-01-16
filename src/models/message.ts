export interface IMessage {
  chatId: number;
  Content: IMessageContent;
  Author_Name: string;
  Author_ID: string;
  Time: number;
}

interface IMessageContent {
  Message: string;
  Documents: number[];
  Type: string;
}
