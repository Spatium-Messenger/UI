import * as React from "react";
import { observer, inject } from "mobx-react";
import { IInputStore, IAppStore } from "src/interfaces/store";
require("./styles.scss");

const micIcon: string = require("assets/microphone-black-shape.svg");
const sendIcon: string = require("assets/email.svg");

interface ISendProps {
  store?: {
    appStore: IAppStore;
    inputStore: IInputStore;
  };
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
    //
    if (this.props.store.inputStore.voiceRecording) {
      // this.props.store.inputStore.doneRecording();
    } else {
      //
    }
  }

  public render() {
    const voiseRecordingEnable = this.props.store.inputStore.voiceRecording ;
    const chatID = this.props.store.appStore.currentChat.ID;
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
