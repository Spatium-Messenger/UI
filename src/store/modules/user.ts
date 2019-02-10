import { observable, action} from "mobx";
// import { IAppStoreModule, IUser } from "../../../interfaces/app_state";
import {IUser, IUserStore} from "src/interfaces/store";
import { IAPI } from "src/interfaces/api";

export default class UserStoreModule implements IUserStore {
  @observable public data: IUser;
  private remoteAPI: IAPI;

  constructor(rootStore: any, remote: IAPI) {
    this.remoteAPI = remote;
    this.data = {token: "", login: "", ID: -1};
  }

  @action
  public async enter(login: string, pass: string) {
    const answer: {result: string} = await this.remoteAPI.user.Enter(login, pass);
    // console.log(answer);
    if (answer.result !== "Error") {
      this.remoteAPI.data.Token = answer["token"];
      await this.getUserID();
      this.data.token = answer["token"];
      this.data.login = login;
    }
    // console.log(answer);
  }

  @action public async create(login: string, pass: string) {
    const answer: {result: string} = await this.remoteAPI.user.CreateUser(login, pass);
    // console.log(answer);
    if (answer.result !== "Error") {
      // console.log(answer["token"]);
      this.remoteAPI.data.Token = answer["token"];
      await this.getUserID();
      this.data.token = answer["token"];
      this.data.login = login;
    }
  }

  @action
  public enterAsAnonymus() {
    //
  }

  private async getUserID() {
    const answer: {result: string} = await this.remoteAPI.user.GetMyData();
    // console.log(answer);
    if (answer.result !== "Error") {
      this.data.ID = answer["id"];
    }
  }

}
