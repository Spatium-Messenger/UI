import * as React from "react";
import { observer, inject } from "mobx-react";
import { IRootStore } from "src/store/interfeces";
import languages from "src/language";
require("./styles.scss");

const closeIcon: string = require("assets/cancel.svg");
const saveIcon: string = require("assets/save.svg");

interface IChatPreferencesUpProps {
  store?: IRootStore;
}

interface IChatPreferencesUpState {
  input: string;
}

@inject("store")
@observer
export default class ChatPreferencesUp extends React.Component<IChatPreferencesUpProps, IChatPreferencesUpState> {
  constructor(props) {
    super(props);
    this.close = this.close.bind(this);
    const chatID = this.props.store.chatStore.currentChatID;
    this.state = {
      input: "",
    };
    if (chatID !== -1) {
      this.state = {
        input: this.props.store.chatStore.getChatData(chatID).Name,
      };
    }
    this.input = this.input.bind(this);
    this.save = this.save.bind(this);
  }

  public close() {
    this.props.store.appStore.changeChatMenu(false);
  }

  public input(e: React.FormEvent<HTMLInputElement>) {
    this.setState({
      input: (e.target as any).value,
    });
  }

  public save() {
    this.props.store.chatStore.setChatName(this.state.input);
  }

  public render() {
    const lang = languages.get(this.props.store.userStore.data.lang).chatPreferences;
    return(
      <div className="chat-preferences-up">
        <div className="chat-preferences-up__body">
          <div className="chat-preferences-up__body__header">
            {lang.up.header}
          </div>
          <div className="chat-preferences-up__body__info">
            <input
              tabIndex={-1}
              type="text"
              onChange={this.input}
              placeholder={lang.up.placeholder}
              value={this.state.input}
            />
            <div
              dangerouslySetInnerHTML={{__html: saveIcon}}
              onClick={this.save}
            />
          </div>
        </div>
      </div>
    );
  }
}
