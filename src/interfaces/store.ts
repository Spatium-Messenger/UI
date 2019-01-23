import { IChat } from "src/models/chat";
import { IMessage } from "src/models/message";
import { IDocument, IDocumentUpload } from "src/models/document";

export interface IAppStore {
  user: IUser;
  chats: IChat[];
  currentChat: IChat;
  messages: {[key: number]: IMessage[]};
  chooseChat: (chat: IChat) => void;
}

export interface IInputStore {
  chatsInputData: {[key: number]: IInputData};
  uploadDocuments: (docs: IDocumentUpload[]) => void;
}

export interface IInputData {
  documents: IDocument[];
  text: string;
}

export interface IUser {
  login: string;
  token: string;
}
