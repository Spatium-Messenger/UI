import * as React from "react";
import { observer, inject } from "mobx-react";
import { IAppStore, IInputStore, IChatStore } from "src/interfaces/store";
import { IRootStore } from "src/store/interfeces";
import languages from "src/language";
require("./styles.scss");

const autosie = require("autosize");

interface ITextAreaProps {
  store?: IRootStore;

}

@inject("store")
@observer
export default class TextArea extends React.Component<ITextAreaProps> {
  private inputRef: React.RefObject<HTMLTextAreaElement>;
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.inputRef = React.createRef();
  }

  public componentDidMount() {
    const el = this.inputRef.current;
    autosie(el);
    el.addEventListener("autosize:resized", () => {
      // Documents relative action
    });

  }

  public handleKeyPress(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.nativeEvent.keyCode  === 13) {
      if (!e.shiftKey) {
        e.preventDefault();
        this.props.store.inputStore.sendMessage();
      }
    }
  }

  public handleChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    this.props.store.inputStore.setTextInput(e.target.value);
  }

  public render() {
    const lang = languages.get(this.props.store.userStore.data.lang).messages.input;
    const chatID = this.props.store.chatStore.currentChat.ID;
    const input = this.props.store.inputStore.chatsInputData.get(chatID).text;
    const voiceRecordingEnable = this.props.store.inputStore.voiceRecording;
    return(
      <textarea
        ref={this.inputRef}
        id="inputarea"
        className={"message-input" + (voiceRecordingEnable ? "-shadowed" : "")}
        placeholder={lang.placeholder}
        onChange={this.handleChange}
        value={input}
        rows={1}
        onKeyPress={this.handleKeyPress}
        autoFocus={true}
      />
    );
  }
}
