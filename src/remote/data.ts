import { IAPIData } from "src/interfaces/api";

export default class APIData implements IAPIData {

  get IP(): string {
    return this._IP;
  }

  set IP(newIP: string) {
    this._IP = newIP;
  }

  get Token(): string {
    return this.token;
  }

  set Token(newToken: string) {
    this.token = newToken;
  }
  public Logs: boolean;
  public Imitation: boolean;
  private _IP: string;
  private token: string;
  constructor(
    ip: string,
    token: string,
    logs: boolean,
    imitation: boolean) {
    this._IP = "";
    this.token = "";
    this.Logs = logs;
    this.Imitation = imitation;
  }

}
