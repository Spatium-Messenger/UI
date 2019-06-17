import {IAPI, IAPIData} from "src/interfaces/api";
import { IAPIFile } from "src/interfaces/api/file";

import APIFile from "./file";
import { IAPIAudio } from "src/interfaces/api/audio";
import APIAudio from "./audio";
import { IAPIUser } from "src/interfaces/api/user";
import { APIUser } from "./user";
import { IAPIChat } from "src/interfaces/api/chat";
import { APIChat } from "./chat";
import { IAPIMessages } from "src/interfaces/api/messages";
import APIMessages from "./messages";

export interface IReqError {
  result: string;
  type: string;
}

export interface IServerInfo {
  cert: boolean;
  maxFileSize: number;
}

export class RemoteAPI implements IAPI {
  public data: IAPIData;
  public file: IAPIFile;
  public audio: IAPIAudio;
  public user: IAPIUser;
  public chat: IAPIChat;
  public messages: IAPIMessages;
  constructor(apiConfig: IAPIData) {
    this.data = apiConfig;
    this.file = new APIFile(this.data);
    this.audio = new APIAudio(this.data);
    this.user = new APIUser(this.data);
    this.chat = new APIChat(this.data);
    this.messages = new APIMessages(this.data);
  }

  public async GetInfo(): Promise<IReqError | IServerInfo> {
    const xhr: XMLHttpRequest = new XMLHttpRequest();
    try {
      xhr.open("GET", this.data.URL + "/info", true);
    } catch (e) {
      return ({result: "Error", type: e} as any);
    }
    xhr.send();
    return new Promise((resolve) => {
      const timeout =
      setTimeout(() => {xhr.abort(); resolve({result: "Error", type: "Timeout"}); }, 5000);
      xhr.onreadystatechange = () => {
      if (xhr.readyState !== 4) { return; }
      if (xhr.status === 200) {
        if (xhr.responseText === "null") {
          clearTimeout(timeout);
          resolve(null);
          return;
        }
        clearTimeout(timeout);
        const answer = JSON.parse(xhr.responseText);
        resolve(answer);
      }
    };
    });
  }

}
