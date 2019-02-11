import { IRootStore } from "./interfeces";
import AppStoreModule from "./modules/app";
import {IAppStore, IInputStore, IMessagesStore, IChatStore, IUser, IUserStore} from "src/interfaces/store";
import InputStoreModule from "./modules/input";
import MessagesStore from "./modules/messages";
import { IAPI } from "src/interfaces/api";
import ChatStoreModule from "./modules/chat";
import UserStoreModule from "./modules/user";
import { ICookie } from "src/interfaces/cookie";

export default class RootStore implements IRootStore {
  public appStore: IAppStore;
  public inputStore: IInputStore;
  public messagesStore: IMessagesStore;
  public chatStore: IChatStore;
  public userStore: IUserStore;
  private remoteAPI: IAPI;
  private cookie: ICookie;

  constructor(remoteAPI: IAPI, cookieController: ICookie) {
    this.remoteAPI = remoteAPI;
    this.cookie = cookieController;
    this.appStore = new AppStoreModule(this);
    this.inputStore = new InputStoreModule(this, this.remoteAPI);
    this.messagesStore = new MessagesStore(this, this.remoteAPI);
    this.chatStore = new ChatStoreModule(this, this.remoteAPI);
    this.userStore = new UserStoreModule(this, this.remoteAPI, this.cookie);
  }
}
