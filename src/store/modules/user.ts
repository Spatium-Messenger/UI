import { observable, action} from "mobx";
// import { IAppStoreModule, IUser } from "../../../interfaces/app_state";
import {IUser, IUserStore, LANGUAGES} from "src/interfaces/store";
import { IAPI } from "src/interfaces/api";
import { IRootStore } from "../interfeces";
import { ICookie } from "src/interfaces/cookie";
import Cookie from "src/hard/cookie";
import { IWebSocket } from "src/interfaces/web-socket";
import ru from "src/language/langs/ru";

const TOKEN_COOKIE_NAME = "token";
const LOGIN_COOKIE_NAME = "login";

export default class UserStoreModule implements IUserStore {
  @observable public data: IUser;
  private remoteAPI: IAPI;
  private rootStore: IRootStore;
  private cookie: ICookie;
  private webScoketConnection: IWebSocket;

  constructor(rootStore: IRootStore) {
    this.remoteAPI = rootStore.remoteAPI;
    this.data = {token: "", login: "", ID: -1, lang: ru.id};
    this.rootStore = rootStore;
    this.cookie = rootStore.cookie;
    this.webScoketConnection = rootStore.webScoketConnection;
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
    this.remoteAPI.data.Token = "";
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
    this.webScoketConnection.CreateConnection();
    await this.getUserID();
    await this.loadAllData();
    this.webScoketConnection.Auth();
  }

  private async loadAllData() {
    await this.rootStore.chatStore.loadChats();
  }

}
