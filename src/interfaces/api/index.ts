import { IAPIFile } from "./file";
import { IAPIAudio } from "./audio";

export interface IAPI {
  data: IAPIData;
  file: IAPIFile;
  audio: IAPIAudio;
}

export interface IAPIData {
  IP: string;
  Token: string;
  Logs: boolean;
  Imitation: boolean;
}
