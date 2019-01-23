import { IRootStore } from "./interfeces";
import AppStoreModule from "./modules/app";
import {IAppStore, IInputStore} from "src/interfaces/store";
import InputStoreModule from "./modules/input";
import { IAPI } from "src/interfaces/api";

export default class RootStore implements IRootStore {
  public appStore: IAppStore;
  public inputStore: IInputStore;
  private remoteAPI: IAPI;

  constructor(remoteAPI: IAPI) {
    this.remoteAPI = remoteAPI;
    this.appStore = new AppStoreModule(this);
    this.inputStore = new InputStoreModule(this, this.remoteAPI);
  }
}
