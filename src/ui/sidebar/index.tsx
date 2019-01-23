import * as React from "react";
import { observer, inject } from "mobx-react";
import {IAppStore} from "src/interfaces/store";
import UpPanel from "./up";
import SideBarItem from "./item";
import { IChat } from "src/models/chat";

require("./styles.scss");

interface ISideBarProps {
  store?: {
    appStore: IAppStore;
  };
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
    this.newChat = this.newChat.bind(this);
  }

  public searchChange(n: string) {
    this.setState({
      search: n,
    });
  }

  public chooseChat(chat: IChat) {
    this.props.store.appStore.chooseChat(chat);
  }

  public newChat() {
    //
  }

  public render() {
    const search: string = this.state.search;
    const chats: JSX.Element[] = [];
    this.props.store.appStore.chats.map(
      (value, i) => {
        let currentID = -1;
        if (this.props.store.appStore.currentChat) {
          currentID = this.props.store.appStore.currentChat.ID;
        }
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

    return(
      <div className="sidebar">
          <UpPanel onChange={this.searchChange}/>
          <div className="sidebar__items">
            {chats}
            <div className="sidebar__items__notfound">
              {(chats.length === 0 ? "Not found" : "")}
            </div>
          </div>
          {/* <NewButton onClick={this.newChat}/> */}
      </div>
    );
  }
}
