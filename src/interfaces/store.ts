import { IChat } from "src/models/chat";
import { IMessage } from "src/models/message";
import { IDocument, IDocumentUpload } from "src/models/document";
import { IAudioMessage } from "src/models/audio";

export enum MODALS_ID {CREATE_CHAT, NULL}

export interface IAppStore {
  modal: MODALS_ID;
  changeModal: (type: MODALS_ID) => void;
}

export interface IChatStore {
  chats: IChat[];
  currentChat: IChat;
  chooseChat: (chat: IChat) => void;
  loadChats: () => void;
  createChat: (name: string) => void;
}

export interface IUserStore {
  data: IUser;
  enter: (login: string, pass: string) => void;
  create: (login: string, pass: string) => void;
  checkUserWasSignIn: () => Promise<boolean>;
  enterAsAnonymus: () => void;
}

export interface IMessagesStore {
  messages: Map<number, IChatsMessages>;
  loadMessages: (chatID: number) => void;
}

export interface IChatsMessages {
  messages: IMessage[];
  allLoaded: boolean;
}

export interface IInputStore {
  voiceRecording: boolean;
  voiceVolumes: number[];
  voiceMessages: Map<number, IAudioMessage>;
  chatsInputData: Map<number, IInputData>;
  setTextInput: (text: string) => void;
  uploadDocuments: (docs: IDocumentUpload[]) => void;
  deleteDocument: (doc: IDocumentUpload) => void;
  cancelVoiceRecording: () => void;
  sendMessage: () => void;
  changeRecording: (val: boolean) => void;
  stopRecording: () => void;
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
