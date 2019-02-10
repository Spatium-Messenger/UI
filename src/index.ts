import APIData from "./remote/data";
import RemoteAPI from "./remote";
import CreateUI from "./ui";

const IP = "http://192.168.56.1:1234";
const LOGS = true;
const IMITATION = true;

const rempoteAPIConfig = new APIData(IP, "", LOGS, IMITATION);
const remoteAPI = new RemoteAPI(rempoteAPIConfig);
const UI = CreateUI(remoteAPI);
