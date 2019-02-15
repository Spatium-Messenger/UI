import { IWebSocket } from "src/interfaces/web-socket";
import { IMessage } from "src/models/message";
import { IAPIData } from "src/interfaces/api";

const ERROR_CONNECTION_TRY_LIMIT: string = "WS Error connection limit";
const ERROR_AUTH_CONNECT_OR_TOKEN: string = "WS Error connection or token is undefined";

const WS_SEND_LOG: string = "WS Sended message: ";
const WS_RECIEVE_LOG: string = "WS Recieved message:";

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
      const serialMessage: string = JSON.stringify(message);
      this.socket.send(serialMessage);
      if (this.data.Logs) {
        console.log(WS_SEND_LOG, serialMessage);
      }
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
        throw Error(ERROR_CONNECTION_TRY_LIMIT);
      }
    };

    this.socket.onmessage = (event) => {
      if (this.data.Logs) {
        console.log(WS_RECIEVE_LOG, event.data);
      }
      if (this.OnMessage) {
        this.OnMessage(JSON.parse(event.data));
      }
    };
  }

  public Auth() {
    if (this.connected && this.data.Token !== "") {
      const serialMessage: string = JSON.stringify({
        type: "system",
        Content: {
          Type: "authoriz",
          Token: this.data.Token,
        },
      });
      this.socket.send(serialMessage);
      if (this.data.Logs) {
        console.log(WS_SEND_LOG, serialMessage);
      }
    } else {
      throw Error(ERROR_AUTH_CONNECT_OR_TOKEN);
    }
  }

  private push() {
    //
  }

  private closeConnection() {
    //
  }
}
