import APIData from "./remote/data";
import RemoteAPI from "./remote";
import CreateUI from "./ui";
import Cookie from "./hard/cookie";
import { ICookie } from "./interfaces/cookie";
import WebSocketAPI from "./hard/web-socket";
import { IWebSocket } from "./interfaces/web-socket";
import { ILocalStorage } from "./interfaces/local-storage";
import LocalStorage from "./hard/local-storage";
import { GenerateKeys, Test } from "./hard/crypto";

const URL = "http://localhost:3030";
const LOGS = true;
const IMITATION = false;

const openLinkFunc = (link: string, name: string) => {
  const a = document.createElement("a");
  a.setAttribute("href", link);
  a.setAttribute("target", "_blank");
  a.setAttribute("download", name);
  a.click();
};

GenerateKeys();
// Test();
const storage: ILocalStorage = new LocalStorage();
const cookie: ICookie = new Cookie();
const rempoteAPIConfig = new APIData(URL, "", LOGS, IMITATION);
const webSocketSystem: IWebSocket = new WebSocketAPI(rempoteAPIConfig);
const remoteAPI = new RemoteAPI(rempoteAPIConfig);
const UI = CreateUI(remoteAPI, cookie, webSocketSystem, storage, openLinkFunc);
// webSocketSystem.CreateConnection();
