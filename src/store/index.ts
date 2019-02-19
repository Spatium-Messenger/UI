import { IRootStore } from "./interfeces";
import AppStoreModule from "./modules/app";
import {IAppStore, IInputStore, IMessagesStore, IChatStore, IUser, IUserStore} from "src/interfaces/store";
import InputStoreModule from "./modules/input";
import MessagesStore from "./modules/messages";
import { IAPI } from "src/interfaces/api";
import ChatStoreModule from "./modules/chat";
import UserStoreModule from "./modules/user";
import { ICookie } from "src/interfaces/cookie";
import { IWebSocket } from "src/interfaces/web-socket";
import { ILocalStorage } from "src/interfaces/local-storage";

export default class RootStore implements IRootStore {
  public appStore: IAppStore;
  public inputStore: IInputStore;
  public messagesStore: IMessagesStore;
  public chatStore: IChatStore;
  public userStore: IUserStore;
  public remoteAPI: IAPI;
  public cookie: ICookie;
  public webScoketConnection: IWebSocket;
  public storage: ILocalStorage;

  constructor(
      remoteAPI: IAPI,
      cookieController: ICookie,
      websocket: IWebSocket,
      storage: ILocalStorage,
      openLink: (link: string, name: string) => void,
    ) {
    this.remoteAPI = remoteAPI;
    this.cookie = cookieController;
    this.webScoketConnection = websocket;
    this.storage = storage;
    this.appStore = new AppStoreModule(this);
    this.inputStore = new InputStoreModule(this);
    this.messagesStore = new MessagesStore(this, openLink);
    this.chatStore = new ChatStoreModule(this);
    this.userStore = new UserStoreModule(this);
  }
}
