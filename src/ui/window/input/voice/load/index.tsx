import * as React from "react";
import { observer, inject } from "mobx-react";
import { IAudioMessage } from "src/models/audio";
import { IInputData, IInputStore, IAppStore, IChatStore } from "src/interfaces/store";
// tslint:disable-next-line
import CircularProgress from "@material-ui/core/CircularProgress";
import { IChat } from "src/models/chat";
require("./styles.scss");

interface IVoiceLoadingProps {
  store?: {
    appStore: IAppStore,
    inputStore: IInputStore,
    chatStore: IChatStore;
  };
}

@inject("store")
@observer
export default class VoiceLoading extends React.Component<IVoiceLoadingProps> {
  constructor(props) {
    super(props);
  }
  public render() {
    const chatID = this.props.store.chatStore.currentChat.ID;
    const message = this.props.store.inputStore.voiceMessages.get(chatID);
    return(
      <div className="voice-record-active">
        <div className="voice-record-load__circle">
          <CircularProgress
            variant="static"
            value={((message.uploaded / message.src.blob.size) * 100)}
            className="voice-record-load__circle-inner"
            size={28}
          />
        </div>
        <div  className="voice-record__load-progress">
          <div
            className="voice-record__load-progress__inner"
            style={{width: (message.uploaded / message.src.blob.size * 100) + "%"}}
          />
        </div>
        <div className="voice-record__load-progress-size">
            {this.size(message.uploaded, 2) + "/" + this.size(message.src.blob.size, 2)}
          </div>
      </div>
    );
  }

  private size(bytes: number, point: number): string {
    if (bytes === 0) { return "0 B"; }
    const k = 1024;
    const dm = point <= 0 ? 0 : point || 2;
    const sizes = ["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
  }
}
