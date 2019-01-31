import * as React from "react";
import { observer, inject } from "mobx-react";
import { IInputStore, IAppStore } from "src/interfaces/store";
import PlayVoiceMessage from "./play";
require("./styles.scss");

interface IVoiceProps {
  store?: {
    appStore: IAppStore;
    inputStore: IInputStore;
  };
}

@inject("store")
@observer
export default class Voice extends React.Component<IVoiceProps> {
  constructor(props) {
    super(props);
    this.stopRecording = this.stopRecording.bind(this);
  }

  public stopRecording() {
    // this.props.store.inputStore.changeRecording(false);
    this.props.store.inputStore.doneRecording();
  }

  public render() {
    const voiceVolumes = this.props.store.inputStore.voiceVolumes;
    const timeLine: JSX.Element[] = voiceVolumes.slice(0).reverse().map((v, i) =>
      <div
        key={i}
        className="voice-record__timeline__item"
      >
        <div style={{height: (v + 1) + "px"}}/>
      </div>,
    );
    const chatID = this.props.store.appStore.currentChat.ID;
    if (this.props.store.inputStore.voiceMessages.get(chatID)) {
      return(<PlayVoiceMessage data={this.props.store.inputStore.voiceMessages.get(chatID)}/>);
    }
    return(
      <div className={"voice-record" + (this.props.store.inputStore.voiceRecording ? "-active" : "")}>
        <div className="voice-record__stop" onClick={this.stopRecording}>
          <div/>
        </div>
        <div  className="voice-record__timeline">
          {timeLine}
        </div>
      </div>
    );
  }
}
