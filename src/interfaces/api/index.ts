import { IAPIFile } from "./file";
import { IAPIAudio } from "./audio";
import { IAPIUser } from "./user";
import { IAPIChat } from "./chat";
import { IAPIMessages } from "./messages";

export interface IAnswerError {
  result: string;
  type: string;
}

export interface IAPI {
  data: IAPIData;
  file: IAPIFile;
  audio: IAPIAudio;
  user: IAPIUser;
  chat: IAPIChat;
  messages: IAPIMessages;
}

export interface IAPIData {
  URL: string;
  Token: string;
  Logs: boolean;
  Imitation: boolean;
}
