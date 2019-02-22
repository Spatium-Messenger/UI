import { IChat, IChatUser } from "src/models/chat";
import { IMessage } from "src/models/message";
import { IDocument, IDocumentUpload } from "src/models/document";
import { IAudioMessage } from "src/models/audio";
import { IAnswerError } from "./api";

export enum MODALS_ID {
  LANGUAGE,
  CACHE,
  ADD_USERS,
  CREATE_CHAT,
  NULL,
}

export interface IAppStore {
  modal: MODALS_ID;
  changeModal: (type: MODALS_ID) => void;
  menu: boolean;
  changeMenu: (val: boolean) => void;
  chatMenu: boolean;
  changeChatMenu: (val: boolean) => void;
}

export interface IFileStore {
  audioBuffers: Map<string, {el: HTMLAudioElement, d: number}>;
  getAudio: (fileID: number) => Promise<{duration: number, blob: Blob} | {result: string}>;
  getImage: (fileID: number, ext: string) => Promise<string>;
  downloadFile: (fileID: number,  name: string) => void;
  getCacheSize: () => string;
  clearCache: () => void;
}

export interface IChatStore {
  chats: IChat[];
  currentChat: IChat;
  users: Map<number, IChatUser[]>;
  chooseChat: (chat: IChat) => void;
  loadChats: () => void;
  createChat: (name: string) => void;
  getChatUsers: () => void;
  getUsersForAdd: (name: string) => Promise<IAnswerError | IChatUser[]>;
  addUserToChat: (userID: number) => Promise<IAnswerError>;
  clear: () => void;
}

export interface IUserStore {
  data: IUser;
  enter: (login: string, pass: string) => void;
  create: (login: string, pass: string) => void;
  checkUserWasSignIn: () => Promise<boolean>;
  enterAsAnonymus: () => void;
  setLang: (lang: string) => void;
  logout: () => void;
}

export interface IMessagesStore {
  messages: Map<number, IChatsMessages>;
  loadMessages: (chatID: number) => void;

  clear: () => void;
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
  clear: () => void;
}

export interface IInputData {
  documents: IDocumentUpload[];
  text: string;
}

export interface IUser {
  login: string;
  token: string;
  ID: number;
  lang: string;
}
