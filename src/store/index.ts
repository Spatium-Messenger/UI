import { IRootStore } from "./interfeces";
import AppStoreModule from "./modules/app";
import {IAppStore, IInputStore, IMessagesStore} from "src/interfaces/store";
import InputStoreModule from "./modules/input";
import MessagesAppStore from "./modules/messages";
import { IAPI } from "src/interfaces/api";

export default class RootStore implements IRootStore {
  public appStore: IAppStore;
  public inputStore: IInputStore;
  public messagesStore: IMessagesStore;
  private remoteAPI: IAPI;

  constructor(remoteAPI: IAPI) {
    this.remoteAPI = remoteAPI;
    this.appStore = new AppStoreModule(this);
    this.inputStore = new InputStoreModule(this, this.remoteAPI);
    this.messagesStore = new MessagesAppStore(this, this.remoteAPI);
  }
}
