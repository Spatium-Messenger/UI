import { IAPIFile } from "./file";
import { IAPIAudio } from "./audio";
import { IAPIUser } from "./user";

export interface IAPI {
  data: IAPIData;
  file: IAPIFile;
  audio: IAPIAudio;
  user: IAPIUser;
}

export interface IAPIData {
  IP: string;
  Token: string;
  Logs: boolean;
  Imitation: boolean;
}
