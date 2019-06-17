import * as React from "react";
import { observer, inject } from "mobx-react";
import { IRootStore } from "src/ui/store/interfeces";
import languages from "src/language";

import PeopleItem from "./item";
import { MODALS_ID } from "src/interfaces/store";
require("./styles.scss");

const plusIcon: string = require("assets/add.svg");
const minusIcon: string = require("assets/minus.svg");

interface IChatPreferencesPeopleProps {
  store?: IRootStore;
}

interface IChatPreferencesPeopleState {
  open: boolean;
  choosen: number;
}

@inject("store")
@observer
export default class ChatPreferencesPeople extends React.Component<
  IChatPreferencesPeopleProps, IChatPreferencesPeopleState> {
  constructor(props) {
    super(props);
    this.state = {
      open: true,
      choosen: -1,
    };
    this.change = this.change.bind(this);
    this.addUser = this.addUser.bind(this);
    this.choose = this.choose.bind(this);
  }

  public change() {
    this.setState({
      open: !this.state.open,
    });
  }

  public addUser() {
    this.props.store.appStore.changeModal(MODALS_ID.ADD_USERS);
  }

  public render() {
    const language = languages.get(this.props.store.userStore.data.lang);
    const lang = language.chatPreferences.people;
    const people = this.props.store.chatStore.users.get(this.props.store.chatStore.currentChatID);
    if (!people) {
      return <div/>;
    }
    let users: JSX.Element[] = [];
    if (this.state.open) {
      users = people.map((u, i) =>
        <PeopleItem user={u} key={i + 1} choosen={this.state.choosen} chose={this.choose} lang={language}/>);
      const add =
      <div className="people-item-add" onClick={this.addUser} key={0}>
        <div
          dangerouslySetInnerHTML={{__html: plusIcon}}
        />
        <div>{lang.add}</div>
      </div>;

      users = [add, ...users];
    }
    const icon: string = (this.state.open ? minusIcon : plusIcon);
    return(
      <div className="chat-preferences-people">
        <div className="chat-preferences-people__header">
          <div>{lang.header + " (" + people.length + ")"}</div>
          <div
            onClick={this.change}
            dangerouslySetInnerHTML={{__html: icon}}
          />
        </div>
        <div className="chat-preferences-people__body">
          {users}
        </div>
      </div>
    );
  }

  private choose(id: number) {
    const chatStore = this.props.store.chatStore;
    if (
      chatStore.currentChatID !== -1 &&
      chatStore.getChatData(chatStore.currentChatID) &&
      chatStore.getChatData(chatStore.currentChatID).AdminID !== this.props.store.userStore.data.ID
      ) {
        return;
    }
    this.setState({
      choosen: id,
    });
  }
}
