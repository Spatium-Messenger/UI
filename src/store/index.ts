import { IRootStore } from "./interfeces";
import AppStoreModule from "./modules/app";
import {IAppStore, IInputStore} from "src/interfaces/store";
import InputStoreModule from "./modules/input";

export default class RootStore implements IRootStore {
  public appStore: IAppStore;
  public inputStore: IInputStore;

  constructor() {
    this.appStore = new AppStoreModule(this);
    this.inputStore = new InputStoreModule(this);
  }
}
