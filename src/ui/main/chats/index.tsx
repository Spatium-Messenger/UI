import * as React from "react";
import { observer, inject } from "mobx-react";
import {IAppStore, IChatStore, MODALS_ID} from "src/interfaces/store";
import UpPanel from "./up";
import SideBarItem from "./item";
import { IChat } from "src/models/chat";
import { IRootStore } from "src/store/interfeces";
import languages from "src/language";
import { ILanguage } from "src/language/interface";
import Loader from "src/ui/components/loader";

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
    this.menu = this.menu.bind(this);
  }

  public searchChange(n: string) {
    this.setState({
      search: n,
    });
  }

  public chooseChat(chat: IChat) {
    this.props.store.chatStore.chooseChat(chat);
  }

  public menu() {
    this.props.store.appStore.changeMenu(true);
  }

  public render() {
    const search: string = this.state.search;
    const chats: JSX.Element[] = [];
    this.props.store.chatStore.chats.map(
      (value, i) => {
        const currentID = this.props.store.chatStore.currentChatID;
        if  (value.Name.toLowerCase().indexOf(search.toLowerCase()) !== -1) {
          chats.push(
            <SideBarItem
             chat={value}
             key={i}
             chooseChat={this.chooseChat}
             active={(value.ID === currentID)}
            />,
          );
        }
      },
    );

    const lang: ILanguage = languages.get(this.props.store.userStore.data.lang);
    const content: JSX.Element = (this.props.store.chatStore.loading ?
      <div className="sidebar__load-wrapper">
        <div className="sidebar_load-wrapper-inner">
          <Loader/>
        </div>
      </div> :
      <div className="sidebar__items">
        {chats}
        <div className="sidebar__items__notfound">
          {(chats.length === 0 ? "Not found" : "")}
        </div>
      </div>);

    return(
      <div className="sidebar">
          <UpPanel onChange={this.searchChange} menu={this.menu} placeholder={lang.chats.search}/>
          {content}
      </div>
    );
  }
}
