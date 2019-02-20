import * as React from "react";
import { IMessageContentDoc } from "src/models/message";
require("./styles.scss");

const playIcon: string = require("assets/play.svg");
const pauseButton: string = require("assets/pause.svg");

interface IAudioMessageProps {
  doc: IMessageContentDoc;
  getAudio(fileID: number): Promise<{duration: number, blob: Blob} | {result: string}>;
}

interface IAudioMessageState {
  loaded: boolean;
  duration: number;
  current: number;
  play: boolean;
  error: boolean;
}

export default class AudioMessage extends React.Component<IAudioMessageProps, IAudioMessageState> {
  private audio: HTMLAudioElement;
  private intervals: NodeJS.Timeout;
  private timelineRef: React.RefObject<HTMLDivElement>;

  constructor(props) {
    super(props);
    this.state = {
      loaded: false,
      duration: 1,
      current: 0,
      play: false,
      error: false,
    };
    this.audio = null;
    this.timelineRef = React.createRef();
    this.change = this.change.bind(this);
    this.loaded = this.loaded.bind(this);
    this.timer = this.timer.bind(this);
    this.rewind = this.rewind.bind(this);
  }

  public async load() {
    new Promise(async (res, rej) => {
      const data: {duration: number, blob: Blob} | {result: string} = await this.props.getAudio(this.props.doc.ID);
      if ((data as {result: string}).result !== "Error") {
        res(data);
      } else {
        rej(data);
      }
    }).then((data: {duration: number, blob: Blob}) => {
      this.loaded(data.blob, data.duration);
    }, () => {
      this.setState({
        error: true,
      });
    });
  }

  public componentWillMount() {
    this.load();
  }

  public change() {
    if (!this.state.loaded) {return; }
    if (this.state.play) {
      this.audio.pause();
    } else {
      this.audio.play();
    }
    this.setState({
      play: !this.state.play,
    });
  }

  public rewind(e: React.MouseEvent) {
    if (!this.state.loaded) {return; }
    const x = e.clientX - this.timelineRef.current.offsetLeft;
    const pos =  x / this.timelineRef.current.offsetWidth;
    this.audio.currentTime = pos * this.audio.duration;
    this.setState({
      current: this.audio.currentTime,
    });
  }

  public render() {
    let classname = (this.state.play ? "message-audio__pause-button" : "message-audio__play-button");
    if (!this.state.loaded) {
      classname = "message-audio__load-button";
    }
    const icon = (this.state.play ? pauseButton : playIcon);
    return(
      <div className="message-audio">
        <div
          onClick={this.change}
          className={classname}
          dangerouslySetInnerHTML={{__html: icon}}
        />
        <div className="message-audio__timeline" onClick={this.rewind} ref={this.timelineRef}>
          <div
            className="message-audio__timeline-inner"
            style={{width: (this.state.current / this.state.duration * 100) + "%"}}
          />
        </div>
        <div className="message-audio__duration">
          {this.formatTime(this.state.current) + "/" + this.formatTime(this.state.duration)}
        </div>
      </div>
    );
  }

  private loaded(blob: Blob, duration: number) {
    const audioUrl = URL.createObjectURL(blob);
    this.audio = new Audio(audioUrl);
    this.setState({
      duration,
      loaded: true,
      current: 0,
    });
    this.intervals = setInterval(this.timer, 200);
  }

  private formatTime(duration: number): string {
    const minutes = Math.round(duration / 60);
    const seconds = Math.round(duration % 60);
    return minutes + ":" + (seconds > 9 ? seconds : "0" + seconds);
  }

  private timer() {
    if (this.state.play) {
      const data: {play: boolean, current: number} = {
        current: this.audio.currentTime,
        play: this.state.play,
      };
      if (data.current.toFixed(1) === this.state.duration.toFixed(1)) {
        data.play = false;
        this.audio.pause();
      }
      this.setState(data);
    }
  }
}
