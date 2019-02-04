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
    this.config.timeout = 5000;
  }

  public Send(data: IAPIClassCallProps): Promise<any> {
    const xhr: XMLHttpRequest = new XMLHttpRequest();
    xhr.open(data.type, this.netData.IP + data.uri, true);
    xhr.send(JSON.stringify(data.payload));
    return new Promise((reolve) => {
      const timeout =
      setTimeout(() => {xhr.abort(); reolve({result: "Error", type: "Timeout"}); }, this.config.timeout);
      xhr.onreadystatechange = () => {
      if (xhr.readyState !== 4) { return; }
      if (xhr.status === 200) {
        if (xhr.responseText === "null") {
          clearTimeout(timeout);
          reolve(null);
          return;
        }
        clearTimeout(timeout);
        const answer = JSON.parse(xhr.responseText);
        reolve(answer);
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
