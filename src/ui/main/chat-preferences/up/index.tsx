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
    this.state = {
      input: this.props.store.chatStore.currentChat.Name,
    };
    this.input = this.input.bind(this);
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
    //
  }

  public render() {
    const lang = languages.get(this.props.store.userStore.data.lang).chatPreferences;
    return(
      <div className="chat-preferences-up">
        <div className="chat-preferences-up__header">
          <div>{lang.up.header}</div>
          <div
            dangerouslySetInnerHTML={{__html: closeIcon}}
            onClick={this.close}
          />
        </div>
        <div className="chat-preferences-up__body">
            <div className="chat-preferences-up__body__avatar">
              {this.state.input.substring(0, 2).toUpperCase()}
            </div>
            <div className="chat-preferences-up__body__info">
              <input
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
