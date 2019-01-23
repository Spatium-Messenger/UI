import {IAPI, IAPIData} from "src/interfaces/api";
import { IAPIFile } from "src/interfaces/api/file";
import APIData from "./data";
import APIFile from "./file";

export default class RemoteAPI implements IAPI {
  public data: IAPIData;
  public file: IAPIFile;
  constructor(ip: string, token: "") {
    this.data = new APIData(ip, token);
    this.file = new APIFile(this.data);
  }

}
