import * as React from "react";
import { observer, inject } from "mobx-react";
import TextArea from "./textarea";
require("./styles.scss");

const micIcon: string = require("assets/microphone-black-shape.svg");
const attauchIcon: string = require("assets/clip.svg");
const sendIcon: string = require("assets/email.svg");

interface IWindowInputProps {
}

@inject("store")
@observer
export default class WindowInput extends React.Component<IWindowInputProps> {
  constructor(props) {
    super(props);
  }
  public render() {
    return(
      <div className="window__input">
        <div className="window__input__buttons">
          <div dangerouslySetInnerHTML={{__html: micIcon}}/>
          <div dangerouslySetInnerHTML={{__html: attauchIcon}}/>
        </div>
        <TextArea/>
        <div
          className="window__input__send"
          dangerouslySetInnerHTML={{__html: sendIcon}}
        />
      </div>
    );
  }
}
