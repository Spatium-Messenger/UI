import * as React from "react";
import { observer, inject } from "mobx-react";
import UpPanel from "./up";
import { IChat } from "src/models/chat";
import { IRootStore } from "src/ui/store/interfeces";
import languages from "src/language";
import { ILanguage } from "src/language/interface";
import Loader from "src/ui/components/loader";
import UsersForDialog from "./users";
import Chats from "./chats";

require("./styles.scss");

interface ISideBarProps {
  store?: IRootStore;
}

interface ISideBarState {
  search: string;
}

@inject("store")
@observer
export default class SideBar extends React.Component<ISideBarProps, ISideBarState> {
  constructor(props) {
    super(props);
    this.state = {
      search: "",
    };
    this.searchChange = this.searchChange.bind(this);
    this.chooseChat = this.chooseChat.bind(this);
    this.dialog = this.dialog.bind(this);
    this.menu = this.menu.bind(this);
  }

  public searchChange(n: string) {
    this.setState({
      search: n,
    });
    this.props.store.chatStore.findUsersForDialog(n);
  }

  public chooseChat(chat: IChat) {
    this.props.store.chatStore.chooseChat(chat);
  }

  public menu() {
    this.props.store.appStore.changeMenu(true);
  }

  public render() {
    const chatStore = this.props.store.chatStore;
    const lang: ILanguage = languages.get(this.props.store.userStore.data.lang);
    const content: JSX.Element = (this.props.store.chatStore.loading ?
      <div className="sidebar__load-wrapper">
        <div className="sidebar_load-wrapper-inner">
          <Loader/>
        </div>
      </div> :
      <div className="sidebar__items">
        <Chats
          lang={lang}
          chats={chatStore.chats}
          currentChat={chatStore.currentChatID}
          search={this.state.search}
          chooseChat={this.chooseChat}
        />
      </div>);

    return(
      <div className="sidebar">
          <UpPanel
            onChange={this.searchChange}
            menu={this.menu}
            placeholder={lang.chats.search}
          />
          {content}
      </div>
    );
  }

  private dialog(id: number) {
    console.log(id);
  }
}
