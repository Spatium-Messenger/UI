import { observable, action} from "mobx";
// import { IAppStoreModule, IUser } from "../../../interfaces/app_state";
import {IAppStore, IUser, IInputData} from "src/interfaces/store";
import { IChat } from "src/models/chat";
import {IMessage} from "src/models/message";

export default class AppStoreModule implements IAppStore {
  // @observable public user: IUser;
  // @observable public chats: IChat[];
  // @observable public chatsInputData: {[key: string]: IInputData};
  // @observable public currentChat: IChat;

  constructor(rootStore: any) {
    // this.user = {token: "", login: "", ID: 1};
  }

}
