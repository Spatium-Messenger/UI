import { IRootStore } from "./interfeces";
import AppStoreModule from "./modules/app";
import {IAppStore, IInputStore, IMessagesStore, IChatStore} from "src/interfaces/store";
import InputStoreModule from "./modules/input";
import MessagesStore from "./modules/messages";
import { IAPI } from "src/interfaces/api";
import ChatStoreModule from "./modules/chat";

export default class RootStore implements IRootStore {
  public appStore: IAppStore;
  public inputStore: IInputStore;
  public messagesStore: IMessagesStore;
  public chatStore: IChatStore;
  private remoteAPI: IAPI;

  constructor(remoteAPI: IAPI) {
    this.remoteAPI = remoteAPI;
    this.appStore = new AppStoreModule(this);
    this.inputStore = new InputStoreModule(this, this.remoteAPI);
    this.messagesStore = new MessagesStore(this, this.remoteAPI);
    this.chatStore = new ChatStoreModule(this, this.remoteAPI);
  }
}
