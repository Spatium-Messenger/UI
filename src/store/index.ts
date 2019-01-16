import { IRootStore } from "./interfeces";
import AppStoreModule from "./modules/app";
import {IAppStore} from "src/interfaces/store";

export default class RootStore implements IRootStore {
  public appStore: IAppStore;

  constructor() {
    this.appStore = new AppStoreModule(this);
  }
}
