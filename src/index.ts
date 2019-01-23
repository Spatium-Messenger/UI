import RemoteAPI from "./remote";
import CreateUI from "./messenger";

const IP = "192.168.37.1:1234";

const remoteAPI = new RemoteAPI(IP, "");
const UI = CreateUI(remoteAPI);
