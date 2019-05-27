import { IAPIData } from "src/interfaces/api";
import config from "src/config";
import { EncryptMessage, DecryptMessage } from "src/hard/crypto";

export interface IAPIClassCallProps {
  type: string;
  uri: string;
  payload: any;
}

interface IAPIConfig {
  timeout: number;
}

export default class APIClass {
  protected netData: IAPIData;
  private config: IAPIConfig;
  constructor(data: IAPIData) {
    this.netData = data;
    this.config = {
      timeout: 5000,
    };
  }

  public async Send(data: IAPIClassCallProps): Promise<any> {
    const xhr: XMLHttpRequest = new XMLHttpRequest();
    try {
      xhr.open(data.type, this.netData.URL + data.uri, true);
    } catch (e) {
      return ({result: "Error", type: e} as any);
    }
    const send = JSON.stringify(data.payload);
    // if (!config.cert) {
    //   send = JSON.stringify(await EncryptMessage(this.getKey(), send));
    // }
    xhr.send(send);
    return new Promise((resolve) => {
      const timeout =
      setTimeout(() => {xhr.abort(); resolve({result: "Error", type: "Timeout"}); }, this.config.timeout);
      xhr.onreadystatechange = async () => {
      if (xhr.readyState !== 4) { return; }
      if (xhr.status === 200) {
        if (xhr.responseText === "null") {
          clearTimeout(timeout);
          resolve(null);
          return;
        }
        clearTimeout(timeout);
        const answer = JSON.parse(xhr.responseText);
        // if (!config.cert) {
        //   answer = await DecryptMessage(answer);
        // }
        resolve(answer);
      }
    };
    });

  }

  protected GetDefaultMessage(): IAPIClassCallProps {
    return {
      payload: {token: this.netData.Token},
      type: "POST",
      uri: "",
    };
  }
}
