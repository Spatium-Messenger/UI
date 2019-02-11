import {IAPI, IAPIData} from "src/interfaces/api";
import { IAPIFile } from "src/interfaces/api/file";

import APIFile from "./file";
import { IAPIAudio } from "src/interfaces/api/audio";
import APIAudio from "./audio";
import { IAPIUser } from "src/interfaces/api/user";
import { APIUser } from "./user";
import { IAPIChat } from "src/interfaces/api/chat";
import { APIChat } from "./chat";

export default class RemoteAPI implements IAPI {
  public data: IAPIData;
  public file: IAPIFile;
  public audio: IAPIAudio;
  public user: IAPIUser;
  public chat: IAPIChat;
  constructor(apiConfig: IAPIData) {
    this.data = apiConfig;
    this.file = new APIFile(this.data);
    this.audio = new APIAudio(this.data);
    this.user = new APIUser(this.data);
    this.chat = new APIChat(this.data);
  }

}
