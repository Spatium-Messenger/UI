import * as React from "react";
import { IDocument } from "src/models/document";
// tslint:disable-next-line
import CircularProgress from "@material-ui/core/CircularProgress";
require("./styles.scss");

const icon: string = require("assets/file.svg");

interface IDocumentProps {
  data: IDocument;
}

export default class Document extends React.Component<IDocumentProps> {
  constructor(props) {
    super(props);
    // this.state
  }
  public render() {
    const imageOrDoc = (this.props.data.url.length > 0);
    const file = this.props.data;

    const prewiev = (imageOrDoc ?
      <img src={file.url} className="document-preview-img" /> :
      <div dangerouslySetInnerHTML={{__html: icon}} className="document-preview-default"/>);

    // const loadBar = (file.load ?
    //  <div/> :
    //  <div><CircularProgress /></div>)

    return(
      <div className="document">
        {prewiev}
        <div>
          <div>{this.props.data.src.name}</div>
          <div>{this.props.data.src.size}</div>
        </div>

      </div>
    );
  }
}
