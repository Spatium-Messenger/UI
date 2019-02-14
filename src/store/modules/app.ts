import { observable, action} from "mobx";
import {IAppStore, MODALS_ID} from "src/interfaces/store";

export default class AppStoreModule implements IAppStore {
  @observable public modal: MODALS_ID;

  constructor(rootStore: any) {
    this.modal = MODALS_ID.NULL;
  }

  @action
  public changeModal(type: MODALS_ID) {
    this.modal = type;
  }

}
