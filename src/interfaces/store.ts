import { IChat } from "src/models/chat";
import { IMessage } from "src/models/message";

export interface IAppStore {
  user: IUser;
  chats: IChat[];
  currentChat: IChat;
  messages: {[key: string]: IMessage[]};
}

export interface IUser {
  login: string;
  token: string;
}
