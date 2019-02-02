import * as React from "react";
import { observer, inject } from "mobx-react";
import { IInputStore, IAppStore } from "src/interfaces/store";
import PlayVoiceMessage from "./play";
import VoiceLoading from "./load";
import { IAudioMessage } from "src/models/audio";
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
    this.props.store.inputStore.StopRecording();
  }

  public render() {
    const voiceVolumes = this.props.store.inputStore.voiceVolumes;
    const timeLine: JSX.Element[] = voiceVolumes.slice(0).reverse().map((v, i) =>
      <div
        key={i}
        className="voice-record__timeline__item"
      >
        <div style={{height: (v + 3) + "px"}}/>
      </div>,
    );
    const chatID = this.props.store.appStore.currentChat.ID;
    const voiceMessage: IAudioMessage = this.props.store.inputStore.voiceMessages.get(chatID);
    if (voiceMessage) {
      // console.log(voiceMessage.loaded, "load");
      if (voiceMessage.load === 1) {
        return(<VoiceLoading />);
      }
      return(<PlayVoiceMessage data={voiceMessage}/>);
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
