import * as React from "react";
import { observer, inject } from "mobx-react";
import TextArea from "./textarea";
import DocumentsPanel from "./documents/line";
import DocumentUpload from "./documents/upload";
require("./styles.scss");

const micIcon: string = require("assets/microphone-black-shape.svg");

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
      <div className="window__input__wrapper">
        <div className="window__input__docs">
          <DocumentsPanel/>
        </div>
        <div className="window__input__main">
          <div className="window__input__buttons">
            <div dangerouslySetInnerHTML={{__html: micIcon}}/>
            <DocumentUpload/>
          </div>
          <TextArea/>
          <div
            className="window__input__send"
            dangerouslySetInnerHTML={{__html: sendIcon}}
          />
        </div>
      </div>
    );
  }
}
