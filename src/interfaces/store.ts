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
  voiseRecording: boolean;
  changeRecording: (val: boolean) => void;
  chatsInputData: Map<number, IInputData>;
  setTextInput: (text: string) => void;
  // uploadingDocuments: Map<number, IDocumentUpload[]>;
  uploadDocuments: (docs: IDocumentUpload[]) => void;
  deleteDocument: (doc: IDocumentUpload) => void;
}

export interface IInputData {
  documents: IDocumentUpload[];
  text: string;
  // updateKey: number;
}

export interface IUser {
  login: string;
  token: string;
}
