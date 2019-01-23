import * as React from "react";
import { IDocument, IDocumentUpload } from "src/models/document";
// tslint:disable-next-line
import CircularProgress from "@material-ui/core/CircularProgress";
require("./styles.scss");

const icon: string = require("assets/file.svg");
const trashIcon: string = require("assets/trash.svg");

interface IDocumentProps {
  data: IDocumentUpload;
}

const styles = (theme) => ({
  circular: {
    color: "#6798e5",
    animationDuration: "550ms",
  },
});

export default class Document extends React.Component<IDocumentProps> {
  constructor(props) {
    super(props);
    // this.state
  }
  public render() {
    const imageOrDoc = (this.props.data.url.length > 0);
    const file = this.props.data;

    let prewiev = (imageOrDoc ?
      <div className="document-preview-img" style={{backgroundImage: `url("` + file.url + `")`}}/> :
      <div dangerouslySetInnerHTML={{__html: icon}} className="document-preview-default"/>);

    prewiev = (file.load === 1 ?
      <div dangerouslySetInnerHTML={{__html: icon}} className="document-preview-default"/> :
      prewiev);
    const overlay = (file.load === 2 ?
      <div/> :
      <div className="document-preview-loader">
        <CircularProgress
          variant="static"
          value={(file.uploadedSize / file.src.size) * 100}
          // value={50}
          className="document-preview-loader__circular"
          size={46}
        />
      </div>
    );
    return(
      <div className="document">
        {/* */}
        {overlay}
        {prewiev}
        <div className="document__info">
          <div>
            {this.props.data.src.name}
            <div dangerouslySetInnerHTML={{__html: trashIcon}} className="document-delete"/>
          </div>
          <div className="document__info__load-progress">
            {this.size(this.props.data.uploadedSize, 2) + "/" + this.size(this.props.data.src.size, 2)}
          </div>
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
