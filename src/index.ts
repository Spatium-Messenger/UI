import APIData from "./remote/data";
import RemoteAPI from "./remote";
import CreateUI from "./ui";

const IP = "192.168.37.1:1234";
const LOGS = true;
const IMITATION = true;

const rempoteAPIConfig = new APIData(IP, "", LOGS, IMITATION);
const remoteAPI = new RemoteAPI(rempoteAPIConfig);
const UI = CreateUI(remoteAPI);
