import { IAPIData } from "src/interfaces/api";

export default class APIData implements IAPIData {
  private _IP: string;
  private token: string;
  constructor(ip: string, token: string) {
    this._IP = "";
    this.token = "";
  }

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

}
