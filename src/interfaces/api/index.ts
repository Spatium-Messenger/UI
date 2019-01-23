import { IAPIFile } from "./file";

export interface IAPI {
  data: IAPIData;
  file: IAPIFile;
}

export interface IAPIData {
  IP: string;
  Token: string;
  Logs: boolean;
  Imitation: boolean;
}
