import {IAPI, IAPIData} from "src/interfaces/api";
import { IAPIFile } from "src/interfaces/api/file";

import APIFile from "./file";

export default class RemoteAPI implements IAPI {
  public data: IAPIData;
  public file: IAPIFile;
  constructor(apiConfig: IAPIData) {
    this.data = apiConfig;
    this.file = new APIFile(this.data);
  }

}
