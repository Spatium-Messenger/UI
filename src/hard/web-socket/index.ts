import { IWebSocket,
         IWebSocketUserMessage,
         IWebSocketSystemMessage,
         IWebSocketSystemMessageOnline,
         IServerActionOnlineUser,
         OnlineUserAction,
         IWebSocketSystemMessageUserInsertedToChat,
         IServerActionUserInserted} from "src/interfaces/web-socket";
import {
  IMessage,
  IMessageType,
  IMessageSend,
  IMessageContentDoc,
} from "src/models/message";
import { IAPIData } from "src/interfaces/api";
import { IDocumentUpload } from "src/models/document";
import { IIMessageServer } from "src/remote/interfaces";

const ERROR_CONNECTION_TRY_LIMIT: string = "WS Error connection limit";
const ERROR_AUTH_CONNECT_OR_TOKEN: string = "WS Error connection or token is undefined";

const WS_AUTH_SUCCESS_RESULT = "Success";

const WS_ACTION_ONLINE_USER_ADDED  = "+";

const WS_SEND_LOG: string = "WS Sent message: ";
const WS_RECIEVE_LOG: string = "WS Recieved message:";

const WS_SYSTEM_MESSAGE: string = "system";

const WS_ACTION_AUTH = "auth";
const WS_ACTION_ONLINE_USER = "online_user";
const WS_ACTION_USER_INVITED_CHAT = "user_inserted";

export default class WebSocketAPI implements IWebSocket {
  private data: IAPIData;
  private socket: WebSocket;
  private onMessage: (message: IMessage) => void;
  private onActionOnlineUser: (data: IServerActionOnlineUser) => void;
  private onUserInsertedToChat: (data: IServerActionUserInserted) => void;
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

  set OnUserInsertedToChat(fn: (data: IServerActionUserInserted) => void) {
    this.onUserInsertedToChat = fn;
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
        if ((wmessage as IWebSocketSystemMessage).mtype) {
          this.HandleSystemMessage((wmessage as IWebSocketSystemMessage));
        } else {
          this.HandleUsersMessage((wmessage as IIMessageServer));
        }
      }
    };
  }

  public Auth() {
    if (this.connected && this.data.Token !== "") {
      const serialMessage: string = JSON.stringify({
        type: WS_SYSTEM_MESSAGE,
        Content: {
          Type: WS_ACTION_AUTH,
          Token: this.data.Token,
        },
      });
      this.socket.send(serialMessage);
      if (this.data.Logs) {
        console.log(WS_SEND_LOG, serialMessage);
      }
    } else {
      console.log(this.connected, this.data.Token);
      throw Error(ERROR_AUTH_CONNECT_OR_TOKEN);
    }
  }

  public CloseConnection() {
    this.socket.close();
    this.connected = false;
    this.auth = false;
  }

  private HandleUsersMessage(m: IIMessageServer) {
    const docs: IMessageContentDoc[] = [];
    if (m.message.documents) {
      m.message.documents.forEach((v) => {
        docs.push({
          ID: v.file_id,
          Name: v.name,
          Path: v.path,
          RatioSize: v.ratio_size,
          Size: v.size,
          AdditionalContentLoaded: false,
        });
      });
    }
    const message: IMessage = {
      AuthorID: m.author_id,
      AuthorName: m.author_name,
      ChatID: m.chat_id,
      Content: {
        Documents: docs,
        Message: m.message.content,
        Type: IMessageType.User,
        Command: m.message.command,
      },
      ID: m.id,
      Time: m.time,
    };
    this.onMessage(message);
  }

  private HandleSystemMessage(message: IWebSocketSystemMessage) {
    switch (message.action) {
      case WS_ACTION_AUTH:
        if (message.result === WS_AUTH_SUCCESS_RESULT) {
          this.auth = true;
        }
        break;
      case WS_ACTION_ONLINE_USER:
        const WAOUmessage: IWebSocketSystemMessageOnline = (message as IWebSocketSystemMessageOnline);
        const OUmessage: IServerActionOnlineUser = {
          Chats: WAOUmessage.chats,
          Self: WAOUmessage.self,
          Type: (WAOUmessage.type === WS_ACTION_ONLINE_USER_ADDED ? OnlineUserAction.Increase
            : OnlineUserAction.Reduce),
        };
        this.onActionOnlineUser(OUmessage);
        break;
      case WS_ACTION_USER_INVITED_CHAT:
        this.onUserInsertedToChat({ChatID: (message as IWebSocketSystemMessageUserInsertedToChat).chat_id});
        break;
    }
  }

  private push() {
    //
  }

  private closeConnection() {
    //
  }
}
