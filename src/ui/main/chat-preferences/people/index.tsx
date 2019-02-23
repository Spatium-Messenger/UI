import * as React from "react";
import { observer, inject } from "mobx-react";
import { IRootStore } from "src/store/interfeces";
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
}

@inject("store")
@observer
export default class ChatPreferencesPeople extends React.Component<
  IChatPreferencesPeopleProps, IChatPreferencesPeopleState> {
  constructor(props) {
    super(props);
    this.state = {
      open: true,
    };
    this.change = this.change.bind(this);
    this.addUser = this.addUser.bind(this);
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
    const lang = languages.get(this.props.store.userStore.data.lang).chatPreferences.people;
    const people = this.props.store.chatStore.users.get(this.props.store.chatStore.currentChatID);
    if (!people) {
      return <div/>;
    }
    let users: JSX.Element[] = [];
    if (this.state.open) {

      users = people.map((u, i) => <PeopleItem user={u} key={i + 1}/>);
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
}
