import { IAPIData } from "src/interfaces/api";

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

  public Send(data: IAPIClassCallProps): Promise<any> {
    const xhr: XMLHttpRequest = new XMLHttpRequest();
    // console.log("http://" + this.netData.IP + data.uri);
    try {
      xhr.open(data.type, this.netData.URL + data.uri, true);
    } catch (e) {
      // console.log("hello");
      return ({result: "Error", type: e} as any);
    }
    xhr.send(JSON.stringify(data.payload));
    return new Promise((resolve) => {
      const timeout =
      setTimeout(() => {xhr.abort(); resolve({result: "Error", type: "Timeout"}); }, this.config.timeout);
      xhr.onreadystatechange = () => {
      if (xhr.readyState !== 4) { return; }
      if (xhr.status === 200) {
        if (xhr.responseText === "null") {
          clearTimeout(timeout);
          resolve(null);
          return;
        }
        clearTimeout(timeout);
        const answer = JSON.parse(xhr.responseText);
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
