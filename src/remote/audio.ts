import { IAPIAudio } from "src/interfaces/api/audio";
import { IAudioMessage } from "src/models/audio";
import { IAPIData } from "src/interfaces/api";
import {LZString} from "src/hard/compress";

export default class APIAudio implements IAPIAudio {
  private data: IAPIData;
  private uploadPath: string;
  private getPath: string;
  private deletePath: string;
  constructor(data: IAPIData) {
    this.data = data;
    this.uploadPath = "/api/user/uploadFile";
    this.deletePath = "/api/user/deleteFile";
  }

  public async Get(ID: number) {
    //
  }

  public async Upload(
    file: IAudioMessage,
    answer: (file: IAudioMessage, err: boolean) => void,
    progress: (uploadedSize: number) => void) {
      console.log(file.src.blob);
      // const zipBlob = await this.squeeze(file.src.blob, true);
      // console.log(zipBlob);
      // const unzipBlob = await this.squeeze(zipBlob, false);
      // console.log(unzipBlob);
    }

  public async Delete() {
    //
  }

  private async squeeze(data: Blob, squeeze: boolean): Promise<Blob> {
    //
    const reader: FileReader = new FileReader();
    reader.readAsText(data);
    let record: string | ArrayBuffer =  await new Promise((reject) => {
      reader.onload = () => {
        reject(reader.result);
      };
    });
    console.log(record);
    const lz = new LZString();
    record = (squeeze ? lz.compress((record as string)) : lz.decompress((record as string)));
    const newBlob = new Blob([record], {type: `audio/wav`});
    return newBlob;
  }

}
