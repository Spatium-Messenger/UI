import APIData from "./remote/data";
import RemoteAPI from "./remote";
import CreateUI from "./ui";
import Cookie from "./hard/cookie";
import { ICookie } from "./interfaces/cookie";
import WebSocketAPI from "./hard/web-socket";
import { IWebSocket } from "./interfaces/web-socket";

const URL = "http://192.168.1.39:1234";
const LOGS = true;
const IMITATION = true;

const cookie: ICookie = new Cookie();
const rempoteAPIConfig = new APIData(URL, "", LOGS, IMITATION);
const webSocketSystem: IWebSocket = new WebSocketAPI(rempoteAPIConfig);
const remoteAPI = new RemoteAPI(rempoteAPIConfig);
const UI = CreateUI(remoteAPI, cookie, webSocketSystem);
webSocketSystem.CreateConnection();
