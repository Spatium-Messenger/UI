import { IWebSocket,
         IWebSocketUserMessage,
         IWebSocketSystemMessage,
         IWebSocketUserMessageRecieve,
         IWebSocketSystemMessageAuth,
         IWebSocketSystemMessageOnline,
         IServerActionOnlineUser,
         OnlineUserAction} from "src/interfaces/web-socket";
import { IMessage, IMessageType, IMessageSend, IMessageContentDoc } from "src/models/message";
import { IAPIData } from "src/interfaces/api";
import { IDocumentUpload } from "src/models/document";
import { IIMessageServer } from "src/remote/interfaces";

const ERROR_CONNECTION_TRY_LIMIT: string = "WS Error connection limit";
const ERROR_AUTH_CONNECT_OR_TOKEN: string = "WS Error connection or token is undefined";

const WS_SEND_LOG: string = "WS Sended message: ";
const WS_RECIEVE_LOG: string = "WS Recieved message:";

const WS_ACTION_AUTH = "authoriz";
const WS_ACTION_ONLINE_USER = "online-user";

export default class WebSocketAPI implements IWebSocket {
  private data: IAPIData;
  private socket: WebSocket;
  private onMessage: (message: IMessage) => void;
  private onActionOnlineUser: (data: IServerActionOnlineUser) => void;
  private connected: boolean;
  private auth: boolean;
  private tryLimit: number;
  constructor(data: IAPIData) {
    this.data = data;
    this.connected = false;
    this.auth = false;
    this.tryLimit = 5;
  }

  set OnMessage(fn: (data: IMessage) => void) {
    this.onMessage = fn;
  }

  set OnActionOnlineUser(fn: (data: IServerActionOnlineUser) => void) {
      this.onActionOnlineUser = fn;
  }

  public SendMessage(message: IMessageSend) {
    if (this.connected) {
      const webSocketMessage: IWebSocketUserMessage = {
        Type: "mes",
        Content: {
          Chat_Id: message.ChatID,
          Content: {
          content: message.Content.Message,
          documents: message.Content.Documents,
          type: "u_msg",
        },
          Token: this.data.Token,
        },

      };
      const serialMessage: string = JSON.stringify(webSocketMessage);
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
      if (this.onMessage &&  this.onActionOnlineUser) {
        const wmessage: IWebSocketSystemMessage | IIMessageServer = JSON.parse(event.data);
        if ((wmessage as IWebSocketSystemMessage).type_a) {
          switch ((wmessage as IWebSocketSystemMessage).action) {
            case WS_ACTION_AUTH:
              if ((wmessage as IWebSocketSystemMessageAuth).result === "Success") {
                this.auth = true;
              }
              break;
            case WS_ACTION_ONLINE_USER:
              const WAOUmessage: IWebSocketSystemMessageOnline = (wmessage as IWebSocketSystemMessageOnline);
              const OUmessage: IServerActionOnlineUser = {
                Chats: WAOUmessage.chats,
                Self: WAOUmessage.self,
                Type: (WAOUmessage.type === "+" ? OnlineUserAction.Increase : OnlineUserAction.Reduce),
              };
              this.onActionOnlineUser(OUmessage);
              break;
          }
        } else {
          const docs: IMessageContentDoc[] = [];
          if ((wmessage as IIMessageServer).message.documents) {
            (wmessage as IIMessageServer).message.documents.forEach((v) => {
              docs.push({
                ID: v.file_id,
                Name: v.name,
                Path: v.path,
                RatioSize: v.ratio_size,
                Size: v.size,
              });
            });
          }
          const message: IMessage = {
            AuthorID: (wmessage as IIMessageServer).author_id,
            AuthorName: (wmessage as IIMessageServer).author_name,
            ChatID: (wmessage as IIMessageServer).chat_id,
            Content: {
              Documents: docs,
              Message: (wmessage as IIMessageServer).message.content,
              Type: IMessageType.User,
            },
            ID: (wmessage as IIMessageServer).id,
            Time: (wmessage as IIMessageServer).time,
          };
          this.onMessage(message);
        }
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
