import { observable, action} from "mobx";
import {IAppStore, MODALS_ID} from "src/interfaces/store";

export default class AppStoreModule implements IAppStore {
  @observable public modal: MODALS_ID;
  @observable public menu: boolean;

  constructor(rootStore: any) {
    this.modal = MODALS_ID.NULL;
    this.menu = true;
  }

  @action
  public changeModal(type: MODALS_ID) {
    this.modal = type;
  }

  @action
  public changeMenu(val: boolean) {
    this.menu = val;
  }
}
