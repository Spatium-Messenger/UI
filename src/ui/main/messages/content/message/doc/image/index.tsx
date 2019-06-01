import * as React from "react";
import { IMessageContentDoc } from "src/models/message";
import Loader from "src/ui/components/loader";
require("./styles.scss");

const downloadIcon: string = require("assets/download.svg");
const FLOAT_POINT_IMAGE_SIZE = 2;

interface IImageMessageProps {
  doc: IMessageContentDoc;
  getImage: (fileID: number, ext: string) => Promise<string>;
  downloadFile: (fileID: number,  name: string) => void;
}

interface IImageMessageState {
  body: string;
}

export default class ImageMessage extends React.Component<IImageMessageProps, IImageMessageState> {
  constructor(props) {
    super(props);
    this.state = {
      body: "",
    };
    this.download = this.download.bind(this);
  }

  public async componentWillMount() {
    new Promise(async (r) => {
      const data = await this.props.getImage(this.props.doc.ID, this.getExt(this.props.doc.Name));
      r(data);
    }).then((data) => {
      this.setState({
        body: (data as string),
      });
    });
  }

  public download() {
    this.props.downloadFile(this.props.doc.ID, this.props.doc.Name);
  }

  public render() {
    if (this.state.body === "") {
      return(
        <div className="message-image-loading">
          <div className="message-image-loading__loader">
            <Loader/>
          </div>
        </div>
      );
    }

    const styles = {
      background: "url('" + this.state.body + "') 0% 0% / cover",
      width:  Math.floor(Number(this.props.doc.Ratio) * 180),
    };

    return(
      <div
        className="message-image"
        style={styles}
      >
        <div className="message-image__up">
          <div
            onClick={this.download}
            dangerouslySetInnerHTML={{__html: downloadIcon}}
          />
        </div>
        <div className="message-image__down">
          <div>{this.size(this.props.doc.Size, FLOAT_POINT_IMAGE_SIZE)}</div>
        </div>
      </div>
    );
  }

  private getExt(name: string) {
    return name.slice((Math.max(0, name.lastIndexOf(".")) || Infinity) + 1);
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
