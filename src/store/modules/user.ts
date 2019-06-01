import { observable, action} from "mobx";
import {IUser, IUserStore} from "src/interfaces/store";
import { IAPI } from "src/interfaces/api";
import { IRootStore } from "../interfeces";
import { ICookie } from "src/interfaces/cookie";
import { IWebSocket } from "src/interfaces/web-socket";
import en from "src/language/langs/en";
import { UserErrors } from "src/remote/errors";

const TOKEN_COOKIE_NAME = "token";
const LOGIN_COOKIE_NAME = "login";

export default class UserStoreModule implements IUserStore {
  @observable public data: IUser;
  @observable public showSignInErrorMessage: boolean = true;
  @observable public showSignUpErrorMessage: boolean = true;
  @observable public errorCode: number = -1;
  private remoteAPI: IAPI;
  private rootStore: IRootStore;
  private cookie: ICookie;
  private webScoketConnection: IWebSocket;

  constructor(rootStore: IRootStore) {
    this.remoteAPI = rootStore.remoteAPI;
    this.data = {token: "", login: "", ID: -1, lang: en.id, name: ""};
    this.rootStore = rootStore;
    this.cookie = rootStore.cookie;
    this.webScoketConnection = rootStore.webScoketConnection;
  }

  @action
  public async checkUserWasSignIn(): Promise<boolean> {
    const token = this.cookie.Get(TOKEN_COOKIE_NAME);
    if (token) {
      const login = this.cookie.Get(LOGIN_COOKIE_NAME);
      await this.saveToken(token, login);
      return true;
    }
    return false;
  }

  @action
  public async enter(login: string, pass: string) {
    const answer: {result: string, code?: number} = await this.remoteAPI.user.Enter(login, pass);
    if (answer.result !== "Error") {
      await this.saveToken(answer["token"], login);
      this.errorCode = -1;
      this.showSignInErrorMessage = false;
    } else {
      this.errorCode = answer.code;
      this.showSignInErrorMessage = true;
    }
  }

  @action public async create(login: string, pass: string) {
    const answer: {result: string, code?: number} = await this.remoteAPI.user.CreateUser(login, pass);
    if (answer.result !== "Error") {
      await this.saveToken(answer["token"], login);
      this.errorCode = -1;
      this.showSignUpErrorMessage = false;
    } else {
      this.errorCode = answer.code;
      this.showSignUpErrorMessage = true;
    }
  }

  @action
  public async saveSettings(name: string) {
    const answer: {result: string, code?: number} = await this.remoteAPI.user.SetSettings(name);
    if (answer.result !== "Error") {
      this.data.name = name;
    } else {
      console.error(answer);
    }
  }

  @action
  public enterAsAnonymus() {
    //
  }

  @action public setLang(lang: string) {
    this.data.lang = lang;
  }

  @action
  public logout() {
    this.webScoketConnection.CloseConnection();
    this.data.ID = -1;
    this.data.login = "";
    this.data.token = "";
    this.cookie.Set(TOKEN_COOKIE_NAME, "");
    this.cookie.Set(LOGIN_COOKIE_NAME, "");
    this.rootStore.chatStore.clear();
    this.rootStore.inputStore.clear();
    this.rootStore.messagesStore.clear();
    this.rootStore.audioStore.clear();
    this.remoteAPI.data.Token = "";
  }

  private async getUserID() {
    const answer: {result: string, code?: number} = await this.remoteAPI.user.GetMyData();
    if (answer.result !== "Error") {
      this.data.ID = answer["id"];
      this.data.name = answer["name"];
    } else {
      if (answer.code === UserErrors.BasicErrors.WrongToken) {
        this.logout();
      }
    }
  }

  private async saveToken(token: string, login: string) {
    this.cookie.Set(TOKEN_COOKIE_NAME, token);
    this.cookie.Set(LOGIN_COOKIE_NAME, login);
    this.data.token = token;
    this.data.login = login;
    this.remoteAPI.data.Token = token;
    this.webScoketConnection.CreateConnection();
    await this.getUserID();
    await this.loadAllData();
    this.webScoketConnection.Auth();
  }

  private async loadAllData() {
    await this.rootStore.chatStore.loadChats();
  }

}
