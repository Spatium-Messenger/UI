import * as React from "react";
import { observer, inject } from "mobx-react";
import { IInputStore, IAppStore, IChatStore } from "src/interfaces/store";
import { IChat } from "src/models/chat";
import { IRootStore } from "src/store/interfeces";
require("./styles.scss");

const micIcon: string = require("assets/microphone-black-shape.svg");
const sendIcon: string = require("assets/email.svg");

interface ISendProps {
  store?: IRootStore;
}

@inject("store")
@observer
export default class Send extends React.Component<ISendProps> {
  constructor(props) {
    super(props);
    this.voiceClick = this.voiceClick.bind(this);
    this.sendClick = this.sendClick.bind(this);
  }

  public voiceClick() {
    this.props.store.inputStore.changeRecording(true);
  }

  public sendClick() {
    this.props.store.inputStore.sendMessage();
  }

  public render() {
    const voiseRecordingEnable = this.props.store.inputStore.voiceRecording ;
    const chatID = this.props.store.chatStore.currentChat.ID;
    const textInput = this.props.store.inputStore.chatsInputData.get(chatID).text;
    let button = (this.props.store.inputStore.voiceRecording ?
    <div
      className="window__input__send"
      dangerouslySetInnerHTML={{__html: sendIcon}}
      onClick={this.sendClick}
    /> :
    <div
      onClick={this.voiceClick}
      dangerouslySetInnerHTML={{__html: micIcon}}
      className="voice-record__icon"
    />);

    if (textInput.length !== 0 && !voiseRecordingEnable) {
      button =
      <div
        className="window__input__send"
        dangerouslySetInnerHTML={{__html: sendIcon}}
        onClick={this.sendClick}
      />;
    }
    return(
      <div className="sendWrapper">
        {button}
      </div>
    );
  }
}
