import * as React from "react";
require("./styles.scss");

const autosie = require("autosize");
const shift = false;

interface ITextAreaProps {
  //
}

interface ITextAreaState {
  message: string;
}

export default class TextArea extends React.Component<ITextAreaProps, ITextAreaState> {
  private inputRef: React.RefObject<HTMLTextAreaElement>;
  constructor(props) {
    super(props);
    this.state = {
      message: "",
    };
    this.handleChange = this.handleChange.bind(this);
    this.inputRef = React.createRef();
  }

  public componentDidMount() {
    // let elem = getElem("inputTextArea");
    const el = this.inputRef.current;
    autosie(el);
    el.addEventListener("autosize:resized", () => {
      // Documents relative action
    });

  }

  public handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    //
  }

  public handleKeyUp(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    //
  }

  public handleKeyPress(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    //
  }

  public handleChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    this.setState({
      message: e.target.value,
    });
  }

  public render() {
    return(
      <textarea
        ref={this.inputRef}
        id="inputarea"
        className="message-input"
        placeholder="Message..."
        onChange={this.handleChange}
        value={this.state.message}
        id="inputTextArea"
        rows={1}
        onKeyPress={this.handleKeyPress}
        onKeyUp={this.handleKeyUp}
        onKeyDown={this.handleKeyDown}
        autoFocus={true}
      />
    );
  }
}
