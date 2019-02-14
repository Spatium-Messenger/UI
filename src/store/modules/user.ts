import { observable, action} from "mobx";
// import { IAppStoreModule, IUser } from "../../../interfaces/app_state";
import {IUser, IUserStore} from "src/interfaces/store";
import { IAPI } from "src/interfaces/api";
import { IRootStore } from "../interfeces";
import { ICookie } from "src/interfaces/cookie";
import Cookie from "src/hard/cookie";

const TOKEN_COOKIE_NAME = "token";
const LOGIN_COOKIE_NAME = "login";

export default class UserStoreModule implements IUserStore {
  @observable public data: IUser;
  private remoteAPI: IAPI;
  private rootStore: IRootStore;
  private cookie: ICookie;

  constructor(rootStore: any, remote: IAPI, cookieControler: ICookie) {
    this.remoteAPI = remote;
    this.data = {token: "", login: "", ID: -1};
    this.rootStore = rootStore;
    this.cookie = cookieControler;
  }

  @action
  public async checkUserWasSignIn(): Promise<boolean> {
    const token = this.cookie.Get(TOKEN_COOKIE_NAME);
    // console.log(token);
    if (token) {
      // console.log(token);
      const login = this.cookie.Get(LOGIN_COOKIE_NAME);
      await this.saveToken(token, login);
      return true;
    }
    return false;
  }

  @action
  public async enter(login: string, pass: string) {
    const answer: {result: string} = await this.remoteAPI.user.Enter(login, pass);
    // console.log(answer);
    if (answer.result !== "Error") {
      await this.saveToken(answer["token"], login);
    }
    // console.log(answer);
  }

  @action public async create(login: string, pass: string) {
    const answer: {result: string} = await this.remoteAPI.user.CreateUser(login, pass);
    // console.log(answer);
    if (answer.result !== "Error") {
      // console.log(answer["token"]);
      await this.saveToken(answer["token"], login);
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

  private async saveToken(token: string, login: string) {
    this.cookie.Set(TOKEN_COOKIE_NAME, token);
    this.cookie.Set(LOGIN_COOKIE_NAME, login);
    // console.log(document.cookie);
    this.data.token = token;
    this.data.login = login;
    this.remoteAPI.data.Token = token;
    await this.getUserID();
    await this.loadAllData();
  }

  private async loadAllData() {
    await this.rootStore.chatStore.loadChats();
  }

}
