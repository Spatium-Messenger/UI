import * as React from "react";
import { observer, inject } from "mobx-react";
import { IInputStore } from "src/interfaces/store";
require("./styles.scss");

const micIcon: string = require("assets/microphone-black-shape.svg");

interface IVoiceProps {
  store?: {
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
    this.props.store.inputStore.changeRecording(false);
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
