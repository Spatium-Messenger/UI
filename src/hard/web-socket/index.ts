import { IWebSocket } from "src/interfaces/web-socket";
import { IMessage } from "src/models/message";
import { IAPIData } from "src/interfaces/api";

const ERROR_CONNECTION_TIME_LIMIT: string = "WS Error connection limit";

export default class WebSocketAPI implements IWebSocket {
  private data: IAPIData;
  private socket: WebSocket;
  private onMessage: (data: any) => void;
  private connected: boolean;
  private tryLimit: number;
  constructor(data: IAPIData) {
    this.data = data;
    this.connected = false;
    this.tryLimit = 5;
  }

  set OnMessage(fn: (data: any) => void) {
    this.onMessage = fn;
  }

  public SendMessage(message: IMessage) {
    if (this.connected) {
      this.socket.send(JSON.stringify(message));
    }
  }

  public CreateConnection() {
    // URL = "http://192.16..." IP = "192.16..."
    const url: string = "ws://" + this.data.URL.substr(6) + "/ws";
    this.socket = new WebSocket(url);
    this.socket.onopen = () => {
      if (this.data.Logs) {
        console.log("WebSocket successfull connected");
      }
      this.connected = true;
    };

    this.socket.onerror = () => {
      this.tryLimit--;
      if (this.tryLimit > 0) {
        this.CreateConnection();
      } else {
        throw Error(ERROR_CONNECTION_TIME_LIMIT);
      }
    };

    this.socket.onmessage = (event) => {
      if (this.OnMessage) {
        this.OnMessage(JSON.parse(event.data));
      }
    };
  }

  private push() {
    //
  }

  private closeConnection() {
    //
  }
}
