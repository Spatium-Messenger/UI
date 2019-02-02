import {IAPI, IAPIData} from "src/interfaces/api";
import { IAPIFile } from "src/interfaces/api/file";

import APIFile from "./file";
import { IAPIAudio } from "src/interfaces/api/audio";
import APIAudio from "./audio";

export default class RemoteAPI implements IAPI {
  public data: IAPIData;
  public file: IAPIFile;
  public audio: IAPIAudio;
  constructor(apiConfig: IAPIData) {
    this.data = apiConfig;
    this.file = new APIFile(this.data);
    this.audio = new APIAudio(this.data);
  }

}
