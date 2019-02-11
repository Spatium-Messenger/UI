import APIData from "./remote/data";
import RemoteAPI from "./remote";
import CreateUI from "./ui";
import Cookie from "./hard/cookie";
import { ICookie } from "./interfaces/cookie";

const IP = "http://192.168.56.1:1234";
const LOGS = true;
const IMITATION = true;

const cookie: ICookie = new Cookie(document.cookie);
const rempoteAPIConfig = new APIData(IP, "", LOGS, IMITATION);
const remoteAPI = new RemoteAPI(rempoteAPIConfig);
const UI = CreateUI(remoteAPI, cookie);
