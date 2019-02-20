import * as React from "react";
import { observer, inject } from "mobx-react";
import { IRootStore } from "src/store/interfeces";
import {InputField, Button} from "src/ui/components";
import { LANGUAGES_PACK } from "src/interfaces/store";
import languages from "src/language";
require("./styles.scss");

const chatIcon = require("assets/support.svg");

interface ICreateChatProps {
  store?: IRootStore;
}

interface ICreateChatState {
  name: string;
}

@inject("store")
@observer
export default class CreateChat extends React.Component<ICreateChatProps, ICreateChatState> {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
    };
    this.inputChange = this.inputChange.bind(this);
    this.submit = this.submit.bind(this);
  }

  public inputChange(value: string) {
    this.setState({name: value});
  }

  public submit() {
    this.props.store.chatStore.createChat(this.state.name);
  }

  public render() {
    const lang = languages.get(this.props.store.userStore.data.lang).popups.createChat;
    return(
      <div className="create-chat-modal">
        <div
          dangerouslySetInnerHTML={{__html: chatIcon}}
          className="create-chat-modal__icon"
        />
        <div className="modal-header create-chat-modal__header">{lang.header}</div>
        <div className="modal-text create-chat-modal__text">{lang.paragraph}</div>
        <InputField
          onChange={this.inputChange}
          className="create-chat-modal__input"
          placeholder={lang.placeholder}
        />
        <div className="create-chat-modal__bottom">
          <Button
            text={lang.button}
            active={true}
            onClick={this.submit}
            loading={false}
          />
        </div>
      </div>
    );
  }
}
