import APIData from "./remote/data";
import {RemoteAPI, IReqError, IServerInfo} from "./remote";
import UI from "./ui";
import Cookie from "./hard/cookie";
import { ICookie } from "./interfaces/cookie";
import WebSocketAPI from "./hard/web-socket";
import { IWebSocket } from "./interfaces/web-socket";
import { ILocalStorage } from "./interfaces/local-storage";
import LocalStorage from "./hard/local-storage";
import { GenerateKeys, Test } from "./hard/crypto";
import config from "./config";

const URL = "https://192.168.1.38:3030";
const LOGS = true;
const IMITATION = false;

const openLinkFunc = (link: string, name: string) => {
  const a = document.createElement("a");
  a.setAttribute("href", link);
  a.setAttribute("target", "_blank");
  a.setAttribute("download", name);
  a.click();
};

const start = async () => {
  const storage: ILocalStorage = new LocalStorage();
  const cookie: ICookie = new Cookie();
  const remoteAPIConfig = new APIData(URL, "", LOGS, IMITATION);
  const webSocketSystem: IWebSocket = new WebSocketAPI(remoteAPIConfig);
  const remoteAPI = new RemoteAPI(remoteAPIConfig);
  const ui = new UI(remoteAPI, cookie, webSocketSystem, storage, openLinkFunc);
  const serverInfo = await remoteAPI.GetInfo();
  if ((serverInfo as IReqError).type === "Error") {
    console.error(serverInfo);
  } else {
    const sInfo = (serverInfo as IServerInfo);
    config.files.maxSize = sInfo.maxFileSize;
    ui.Render();
  }
};

start();

// GenerateKeys();
// Test();

// webSocketSystem.CreateConnection();
