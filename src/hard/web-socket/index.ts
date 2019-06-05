import {
  IWebSocket,
  IWebSocketUserMessage,
  IWebSocketSystemMessage,
  IWebSocketSystemMessageOnline,
  IServerActionOnlineUser,
  IWebSocketSystemMessageUserInsertedToChat,
  IServerActionUserInserted,
  IWebSocketEncryptedMessage,
  IWebSocketData,
} from "src/interfaces/web-socket";
import {
  IMessage,
  IMessageType,
  IMessageSend,
  IMessageContentDoc,
} from "src/models/message";
import { IIMessageServer } from "src/remote/interfaces";
import { DecryptMessage } from "../crypto";
import { OnlineUserAction } from "src/interfaces/store";

const ERROR_CONNECTION_TRY_LIMIT: string = "WS Error connection limit";
const ERROR_AUTH_CONNECT_OR_TOKEN: string =
  "WS Error connection or token is undefined";

const WS_AUTH_SUCCESS_RESULT = "Success";

const WS_SEND_LOG: string = "WS Sent message: ";
const WS_RECIEVE_LOG: string = "WS Recieved message:";

const WS_SYSTEM_MESSAGE: string = "system";
const WS_USER_MESSAGE: string = "user";
const WS_ENCRYPTED_MESSAGE: string = "encrypted";

const WS_ACTION_AUTH = "auth";
const WS_ACTION_ONLINE_USER = "online_user";
const WS_ACTION_USER_ADDED_TO_CHAT = "add_in_chat";
const WS_ACTION_USER_LEAVE_CHAT = "leave_chat";
const WS_ACTION_USER_RETURN_CHAT = "return_chat";

export default class WebSocketAPI implements IWebSocket {

  set OnMessage(fn: (data: IMessage) => void) {
    this.onMessage = fn;
  }

  set OnActionOnlineUser(fn: (chats: number[]) => void) {
    this.onActionOnlineUser = fn;
  }

  set OnUserInsertedToChat(fn: () => void) {
    this.onUserInsertedToChat = fn;
  }

  set OnClosed(fn: () => void) {
    this.closed = fn;
  }

  set OnUserLeaveChat(fn: () => void) {
    this.onUserLeaveChat = fn;
  }

  set OnUserReturnChat(fn: () => void) {
    this.onUserReturnChat = fn;
  }

  private data: IWebSocketData;
  private socket: WebSocket;
  private onMessage: (message: IMessage) => void;
  private onActionOnlineUser: (chats: number[], w: OnlineUserAction) => void;
  private onUserInsertedToChat: () => void;
  private onUserLeaveChat: () => void;
  private onUserReturnChat: () => void;
  private closed: () => void;
  private connected: boolean = false;
  private authed: boolean = false;
  private tryLimit: number = 5;
  private key: CryptoKey;
  constructor(data: IWebSocketData) {
    this.data = data;
  }

  public GetKey() {
    return this.key;
  }

  public async SendMessage(message: IMessageSend) {
    if (this.connected) {
      const webSocketMessage: IWebSocketUserMessage = {
        mtype: WS_USER_MESSAGE,
        content: {
          chatID: message.ChatID,
          content: {
            content: message.Content.Message,
            documents: message.Content.Documents,
            type: IMessageType.User,
          },
          token: this.data.Token,
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
    const url: string = "wss://" + this.data.URL.substr(6) + "/ws";
    this.socket = new WebSocket(url);
    this.socket.onopen = () => {
      if (this.data.Logs) {
        console.log("WebSocket successfull connected");
      }
      this.connected = true;
      this.tryLimit = 5;
      this.auth();
    };

    this.socket.onclose = () => {
      this.closed();
      this.connected = false;
      this.authed = false;
      this.deferredConnection();
    };

    this.socket.onmessage = (event) => {
      if (this.data.Logs) {
        console.log(WS_RECIEVE_LOG, event.data);
      }
      if (this.onMessage &&  this.onActionOnlineUser) {
        this.MessageHandle(event.data);
      }
    };
  }

  public CloseConnection() {
    this.connected = false;
    this.authed = false;
    this.socket.close();
  }

  private async auth() {
    if (this.connected) {
      // console.log(this.data.Token);
      if (this.data.Token === "") {
        setTimeout(this.auth, 500);
        return;
      }
      const serialMessage: string = JSON.stringify({
        mtype: WS_SYSTEM_MESSAGE,
        content: {
          type: WS_ACTION_AUTH,
          token: this.data.Token,
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

  private async deferredConnection() {
    await new Promise((res) => setTimeout(res, 3000));
    this.tryLimit--;
    if (this.tryLimit > 0) {
      this.CreateConnection();
      return;
    } else {
      throw Error(ERROR_CONNECTION_TRY_LIMIT);
    }
  }

  private MessageHandle(data: string) {
    if (!this.connected) {return; }
    const wmessage: IWebSocketSystemMessage | IIMessageServer | IWebSocketEncryptedMessage = JSON.parse(data);
    switch ((wmessage as IWebSocketSystemMessage).mtype) {
      case WS_SYSTEM_MESSAGE:
        this.HandleSystemMessage((wmessage as IWebSocketSystemMessage));
        break;
      case WS_USER_MESSAGE:
        this.HandleUsersMessage(wmessage as IIMessageServer);
        break;
      case WS_ENCRYPTED_MESSAGE:
        this.HandleEncryptedMessage(wmessage as IWebSocketEncryptedMessage);
        break;
    }
  }

  private HandleUsersMessage(m: IIMessageServer) {
    const docs: IMessageContentDoc[] = [];
    if (m.message.documents) {
      m.message.documents.forEach((v) => {
        docs.push({
          ID: v.id,
          Name: v.name,
          Path: v.path,
          Ratio: v.ratio,
          Size: v.size,
          AdditionalContentLoaded: false,
          Duration: v.duration,
        });
      });
    }
    const message: IMessage = {
      AuthorID: m.author_id,
      AuthorName: m.author_name,
      AuthorLogin: m.author_login,
      ChatID: m.chat_id,
      Content: {
        Documents: docs,
        Message: m.message.content,
        Type: m.message.type,
        Command: m.message.command,
      },
      ID: m.id,
      Time: m.time,
    };
    this.onMessage(message);
  }

  private async HandleSystemMessage(message: IWebSocketSystemMessage) {
    switch (message.action) {
      case WS_ACTION_AUTH:
        if (message.result === WS_AUTH_SUCCESS_RESULT) {
          this.authed = true;
          if (this.data.Logs) {
            console.log("User was authed with server by WS.");
          }
        }
        break;
      case WS_ACTION_ONLINE_USER:
        const WAOUmessage: IWebSocketSystemMessageOnline = message as IWebSocketSystemMessageOnline;
        if (this.onActionOnlineUser) {
          this.onActionOnlineUser(WAOUmessage.chats, WAOUmessage.move);
        }
        break;
      case WS_ACTION_USER_ADDED_TO_CHAT:
        if (this.onUserInsertedToChat) {
          this.onUserInsertedToChat();
        }
        break;
      case WS_ACTION_USER_LEAVE_CHAT:
        if (this.onUserLeaveChat) {
          this.onUserLeaveChat();
        }
        break;
      case WS_ACTION_USER_RETURN_CHAT:
        if (this.onUserReturnChat) {
          this.onUserReturnChat();
        }
        break;
    }
  }

  private async HandleEncryptedMessage(message: IWebSocketEncryptedMessage) {
    const decryptedData = await DecryptMessage({
      Data: message.data,
      IV: message.iv,
      Key: message.key,
    });
    this.MessageHandle(decryptedData);
  }

  private push() {
    //
  }

  private closeConnection() {
    //
  }
}
