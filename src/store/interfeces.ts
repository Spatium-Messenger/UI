import {IAppStore, IInputStore, IMessagesStore, IChatStore, IUserStore} from "src/interfaces/store";
// import {IPopularPageStoreModule} from "./modules/popular_page/interfaces";

export interface IRootStore {
  appStore: IAppStore;
  inputStore: IInputStore;
  messagesStore: IMessagesStore;
  chatStore: IChatStore;
  userStore: IUserStore;
  // popularStore: IPopularPageStoreModule;
}
