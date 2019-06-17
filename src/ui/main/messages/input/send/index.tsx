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
    this.props.store.audioStore.changeRecording(true);
  }

  public sendClick() {
    this.props.store.inputStore.sendMessage();
  }

  public render() {
    const voiseRecordingEnable = this.props.store.audioStore.voiceRecording ;
    const chatID = this.props.store.chatStore.currentChatID;
    const input = this.props.store.inputStore.chatsInputData.get(chatID);
    let button = (this.props.store.audioStore.voiceRecording ?
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

    if (input.text.length !== 0 && !voiseRecordingEnable) {
      button =
      <div
        className="window__input__send"
        dangerouslySetInnerHTML={{__html: sendIcon}}
        onClick={this.sendClick}
      />;
    }

    if (input.text.length === 0 && this.docsCheck(chatID)) {
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

  private docsCheck(chatID: number): boolean {
    let answer: boolean = true;
    const docs = this.props.store.inputStore.chatsInputData.get(chatID).documents;
    if (docs.length === 0) {
      return false;
    }
    docs.forEach((d) => {
      if (!answer) {return ; }
      if (d.load !== 2) { answer = false; }
    });
    return answer;
  }
}
