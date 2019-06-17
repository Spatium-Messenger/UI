import {
  IAppStore,
  IInputStore,
  IMessagesStore,
  IChatStore,
  IUserStore,
  IFileStore,
  IAudioStore,
} from "src/interfaces/store";
import { IAPI } from "src/interfaces/api";
import { ICookie } from "src/interfaces/cookie";
import { IWebSocket } from "src/interfaces/web-socket";
import { ILocalStorage } from "src/interfaces/local-storage";
// import {IPopularPageStoreModule} from "./modules/popular_page/interfaces";

export interface IRootStore {
  appStore: IAppStore;
  inputStore: IInputStore;
  messagesStore: IMessagesStore;
  audioStore: IAudioStore;
  chatStore: IChatStore;
  userStore: IUserStore;
  fileStore: IFileStore;
  remoteAPI: IAPI;
  cookie: ICookie;
  webScoketConnection: IWebSocket;
  storage: ILocalStorage;
  // popularStore: IPopularPageStoreModule;
}
