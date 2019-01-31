import { IChat } from "src/models/chat";
import { IMessage } from "src/models/message";
import { IDocument, IDocumentUpload } from "src/models/document";
import { IAudioMessage } from "src/models/audio";

export interface IAppStore {
  user: IUser;
  chats: IChat[];
  currentChat: IChat;
  chooseChat: (chat: IChat) => void;
}

export interface IMessagesStore {
  messages: Map<number, IChatsMessages>;
}

export interface IChatsMessages {
  messages: IMessage[];
  allLoaded: boolean;
  unreaded: number;
}

export interface IInputStore {
  voiceRecording: boolean;
  voiceVolumes: number[];
  changeRecording: (val: boolean) => void;
  doneRecording: () => void;
  chatsInputData: Map<number, IInputData>;
  setTextInput: (text: string) => void;
  uploadDocuments: (docs: IDocumentUpload[]) => void;
  deleteDocument: (doc: IDocumentUpload) => void;
  voiceMessages: Map<number, IAudioMessage>;
}

export interface IInputData {
  documents: IDocumentUpload[];
  text: string;
}

export interface IUser {
  login: string;
  token: string;
  ID: number;
}
