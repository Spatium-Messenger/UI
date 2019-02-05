import * as React from "react";
import { observer, inject } from "mobx-react";
import TextArea from "./textarea";
import DocumentsPanel from "./documents/line";
import DocumentUpload from "./documents/upload";
import Voice from "./voice";
import Send from "./send";
require("./styles.scss");

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
            <DocumentUpload/>
          </div>
          <Voice/>
          <TextArea/>
          <Send/>
        </div>
      </div>
    );
  }
}
