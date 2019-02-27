import * as React from "react";
import { observer, inject } from "mobx-react";
import { IRootStore } from "src/store/interfeces";
import {InputField, Button} from "src/ui/components";
import languages from "src/language";
require("./styles.scss");

const channelIcon = require("assets/megaphone.svg");

interface ICreateChannelProps {
  store?: IRootStore;
}

interface ICreateChannelState {
  name: string;
}

@inject("store")
@observer
export default class CreateChannel extends React.Component<ICreateChannelProps, ICreateChannelState> {
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
    this.props.store.chatStore.createChannel(this.state.name);
  }

  public render() {
    const lang = languages.get(this.props.store.userStore.data.lang).popups.createChannel;
    return(
      <div className="create-channel-modal">
        <div
          dangerouslySetInnerHTML={{__html: channelIcon}}
          className="create-channel-modal__icon"
        />
        <div className="modal-header create-channel-modal__header">{lang.header}</div>
        <div className="modal-text create-channel-modal__text">{lang.paragraph}</div>
        <InputField
          onChange={this.inputChange}
          className="create-channel-modal__input"
          placeholder={lang.placeholder}
        />
        <div className="create-channel-modal__bottom">
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
