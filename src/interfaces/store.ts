import { IChat, IChatUser } from "src/models/chat";
import { IMessage } from "src/models/message";
import { IDocument, IDocumentUpload } from "src/models/document";
import { IAudioUpload } from "src/models/audio";
import { IAnswerError } from "./api";
import { IFolk } from "src/models/user";

export enum MODALS_ID {
  LANGUAGE,
  CACHE,
  ADD_USERS,
  CREATE_CHAT,
  CREATE_CHANNEL,
  USER_SETTINGS,
  NULL,
}

export enum OnlineUserAction {
  Reduce,
  Increase,
}

export interface IAppStore {
  modal: MODALS_ID;
  changeModal: (type: MODALS_ID) => void;
  menu: boolean;
  changeMenu: (val: boolean) => void;
  chatMenu: boolean;
  changeChatMenu: (val: boolean) => void;
  loading: boolean;
  changeLoading: (val: boolean) => void;
}

export interface IFileStore {
  audioBuffers: Map<string, {el: HTMLAudioElement, timeoff: Date}>;
  getAudio: (fileID: number) => Promise<{duration: number, blob: Blob} | {result: string}>;
  getImage: (fileID: number) => string;
  downloadFile: (fileID: number,  name: string) => void;
  getCacheSize: () => string;
  clearCache: () => void;
}

export interface IAudioStore {
  voiceRecording: boolean;
  voiceVolumes: number[];
  voiceMessages: Map<number, IAudioUpload>;
  recoredingStartedAt: Date;
  cancelVoiceRecording: () => void;
  changeRecording: (val: boolean) => void;
  stopRecording: () => void;
  sendVoiceMessage: (chatID: number) => void;
  clear: () => void;
  getLink(fileID: number): Promise<{link: string, timeoff: Date} | {result: string}>;
}

export interface IChatStore {
  chats: IChat[];
  currentChatID: number;
  users: Map<number, IChatUser[]>;
  usersForDialog: IFolk[];
  loading: boolean;
  getChatData: (id: number) => IChat;
  chooseChat: (chat: IChat) => void;
  loadChats: () => void;
  createChat: (name: string) => void;
  createChannel: (name: string) => void;
  getChatUsers: () => void;
  getUsersForAdd: (name: string) => Promise<IAnswerError | IChatUser[]>;
  addUserToChat: (userID: number) => Promise<IAnswerError>;
  setChatName: (name: string) => void;
  clear: () => void;
  findUsersForDialog: (name: string) => void;
  blockUser: (userID: number) => void;
  unblockUser: (userID: number) => void;
  deleteChatFromList: (chatID: number) => void;
  leaveChat: (chatID: number) => void;
  turnBackToChat: (chatID: number) => void;
}

export interface IUserStore {
  data: IUser;
  enter: (login: string, pass: string) => void;
  create: (login: string, pass: string) => void;
  checkUserWasSignIn: () => Promise<boolean>;
  enterAsAnonymus: () => void;
  setLang: (lang: string) => void;
  logout: () => void;
  saveSettings: (name: string) => void;
  showSignInErrorMessage: boolean;
  showSignUpErrorMessage: boolean;
  errorCode: number;
}

export interface IMessagesStore {
  messages: Map<number, IChatsMessages>;
  loadMessages: (chatID: number) => void;
  clear: () => void;
}

export interface IChatsMessages {
  messages: IMessage[];
  allLoaded: boolean;
  loading: boolean;
}

export interface IInputStore {
  chatsInputData: Map<number, IInputData>;
  setTextInput: (text: string) => void;
  uploadDocuments: (docs: IDocumentUpload[]) => void;
  deleteDocument: (doc: IDocumentUpload) => void;
  sendMessage: () => void;
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
  name: string;
}
