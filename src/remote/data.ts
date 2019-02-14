import { IAPIData } from "src/interfaces/api";

export default class APIData implements IAPIData {

  get URL(): string {
    return this._URL;
  }

  set URL(newURL: string) {
    this._URL = newURL;
  }

  get Token(): string {
    return this.token;
  }

  set Token(newToken: string) {
    this.token = newToken;
  }
  public readonly Logs: boolean;
  public readonly Imitation: boolean;
  private _URL: string;
  private token: string;
  constructor(
    utl: string,
    token: string,
    logs: boolean,
    imitation: boolean) {
    this._URL = utl;
    this.token = token;
    this.Logs = logs;
    this.Imitation = imitation;
  }

}
