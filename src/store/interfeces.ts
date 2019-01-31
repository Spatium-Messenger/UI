import {IAppStore, IInputStore, IMessagesStore} from "src/interfaces/store";
// import {IPopularPageStoreModule} from "./modules/popular_page/interfaces";

export interface IRootStore {
  appStore: IAppStore;
  inputStore: IInputStore;
  messagesStore: IMessagesStore;
  // popularStore: IPopularPageStoreModule;
}
