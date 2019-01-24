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
    this.iconClick = this.iconClick.bind(this);
  }

  public iconClick() {
    this.props.store.inputStore.changeRecording(true);
  }

  public render() {
    return(
      <div className="voice-record">
        {}
      </div>
    );
  }
}
