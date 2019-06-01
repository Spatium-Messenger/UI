import {
  IWebSocket,
  IWebSocketUserMessage,
  IWebSocketSystemMessage,
  IWebSocketSystemMessageOnline,
  IServerActionOnlineUser,
  OnlineUserAction,
  IWebSocketSystemMessageUserInsertedToChat,
  IServerActionUserInserted,
  IWebSocketSystemMessageAuth,
  IWebSocketEncryptedMessage,
  IWebSocketData,
} from "src/interfaces/web-socket";
import {
  IMessage,
  IMessageType,
  IMessageSend,
  IMessageContentDoc,
} from "src/models/message";
import { IAPIData } from "src/interfaces/api";
import { IDocumentUpload } from "src/models/document";
import { IIMessageServer } from "src/remote/interfaces";
import { publicKeyToJWK, JWKToPublicKey, EncryptMessage, PEMTOKEY, DecryptMessage } from "../crypto";

const ERROR_CONNECTION_TRY_LIMIT: string = "WS Error connection limit";
const ERROR_AUTH_CONNECT_OR_TOKEN: string =
  "WS Error connection or token is undefined";

const WS_AUTH_SUCCESS_RESULT = "Success";

const WS_ACTION_ONLINE_USER_ADDED = "+";

const WS_SEND_LOG: string = "WS Sent message: ";
const WS_RECIEVE_LOG: string = "WS Recieved message:";

const WS_SYSTEM_MESSAGE: string = "system";
const WS_USER_MESSAGE: string = "user";
const WS_ENCRYPTED_MESSAGE: string = "encrypted";
// const WS_ACTION_

const WS_ACTION_AUTH = "auth";
const WS_ACTION_ONLINE_USER = "online_user";
const WS_ACTION_USER_INVITED_CHAT = "user_inserted";

export default class WebSocketAPI implements IWebSocket {
  private data: IWebSocketData;
  private socket: WebSocket;
  private onMessage: (message: IMessage) => void;
  private onActionOnlineUser: (data: IServerActionOnlineUser) => void;
  private onUserInsertedToChat: (data: IServerActionUserInserted) => void;
  private connected: boolean;
  private auth: boolean;
  private tryLimit: number;
  private key: CryptoKey;
  constructor(data: IWebSocketData) {
    this.data = data;
    this.connected = false;
    this.auth = false;
    this.tryLimit = 5;
  }

  public GetKey() {
    return this.key;
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

  public async SendMessage(message: IMessageSend) {
    if (this.connected) {
      const webSocketMessage: IWebSocketUserMessage = {
        mtype: WS_USER_MESSAGE,
        content: {
          chatID: message.ChatID,
          content: {
            content: message.Content.Message,
            documents: message.Content.Documents,
            type: "u_msg",
          },
          token: this.data.Token,
        },
      };
      const serialMessage: string = JSON.stringify(webSocketMessage);
      // try {
      //   const encmesssage = await EncryptMessage(this.key, serialMessage);
      //   const encwebsockermessage: IWebSocketEncryptedMessage = {
      //     mtype: WS_ENCRYPTED_MESSAGE,
      //     data: encmesssage.Data,
      //     key: encmesssage.Key,
      //     iv: encmesssage.IV,
      //   };
      //   serialMessage = JSON.stringify(encwebsockermessage);
      // } catch (e) {
      //   console.log(e);
      // }

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
      this.Auth();
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
        this.MessageHandle(event.data);
      }
    };
  }

  // public async KeyExchange() {
  //   if (this.connected) {

  //   }
  // }

  public async Auth() {
    if (this.connected) {
      console.log(this.data.Token);
      if (this.data.Token === "") {
        setTimeout(this.Auth, 500);
        return;
      }
      // const key = await publicKeyToJWK();
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
      // console.log(this.connected, this.data.Token);

      throw Error(ERROR_AUTH_CONNECT_OR_TOKEN);
    }
  }

  public CloseConnection() {
    this.socket.close();
    this.connected = false;
    this.auth = false;
  }

  private MessageHandle(data: string) {
    // console.log("Handling Message - ", data);
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
        Type: IMessageType.User,
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
          // const mkey = (message as IWebSocketSystemMessageAuth).key;
          // this.key = await JWKToPublicKey(jsonkey);
          // this.key = await PEMTOKEY((message as IWebSocketSystemMessageAuth).key);
          this.auth = true;
          if (this.data.Logs) {
            console.log("User was authed with server by WS.");
          }
        }
        break;
      case WS_ACTION_ONLINE_USER:
        const WAOUmessage: IWebSocketSystemMessageOnline = message as IWebSocketSystemMessageOnline;
        const OUmessage: IServerActionOnlineUser = {
          Chats: WAOUmessage.chats,
          Self: WAOUmessage.self,
          Type:
            WAOUmessage.type === WS_ACTION_ONLINE_USER_ADDED
              ? OnlineUserAction.Increase
              : OnlineUserAction.Reduce,
        };
        this.onActionOnlineUser(OUmessage);
        break;
      case WS_ACTION_USER_INVITED_CHAT:
        this.onUserInsertedToChat({
          ChatID: (message as IWebSocketSystemMessageUserInsertedToChat).chat_id,
        });
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
