import { IAPIFile } from "./file";
import { IAPIAudio } from "./audio";
import { IAPIUser } from "./user";
import { IAPIChat } from "./chat";

export interface IAPI {
  data: IAPIData;
  file: IAPIFile;
  audio: IAPIAudio;
  user: IAPIUser;
  chat: IAPIChat;
}

export interface IAPIData {
  IP: string;
  Token: string;
  Logs: boolean;
  Imitation: boolean;
}
