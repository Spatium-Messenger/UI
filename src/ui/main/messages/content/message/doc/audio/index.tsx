import * as React from "react";
import { IMessageContentDoc } from "src/models/message";
require("./styles.scss");

const playIcon: string = require("assets/play.svg");
const pauseButton: string = require("assets/pause.svg");

let COMPONENT_WAS_UNMOUNTED = false;
let LAST_CURRENT_PLAY_POSITION = "-1";

interface IAudioMessageProps {
  doc: IMessageContentDoc;
  audioBuffers: Map<string, {el: HTMLAudioElement, timeoff: Date}>;
  getAudio(fileID: number): Promise<{link: string, timeoff: Date} | {result: string}>;
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
      duration: this.props.doc.Duration / 1000,
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

  public componentWillUnmount() {
    COMPONENT_WAS_UNMOUNTED = true;
    clearInterval(this.intervals);
  }

  public async load() {
    // Check buffers to loaded audio elements
    if (this.state.loaded) {return; }
    const audioElement: {el: HTMLAudioElement, timeoff: Date} = this.props.audioBuffers.get(this.props.doc.Path);
    if (audioElement && !COMPONENT_WAS_UNMOUNTED) {
      this.audio = audioElement.el;
      this.setState({
        loaded: true,
        current: 0,
      });
      this.intervals = setInterval(this.timer, 16);
      return;
    }

    const {ID} = this.props.doc;
    new Promise(async (res, rej) => {
      const data: {link: string, timeoff: Date} | {result: string} = await this.props.getAudio(ID);
      if ((data as {result: string}).result !== "Error") {
        res(data);
      } else {
        rej(data);
      }
    }).then((data: {link: string, timeoff: Date}) => {
      this.loaded(data.link, data.timeoff);
    }, () => {
      if (COMPONENT_WAS_UNMOUNTED) {return; }
      this.setState({
        error: true,
      });
    });
  }

  public componentWillMount() {
    COMPONENT_WAS_UNMOUNTED = false;
    this.load();
  }

  public change() {
    if (!this.state.loaded) {return; }
    if (this.state.play) {
      this.audio.pause();
    } else {
      this.audio.play();
    }
    if (COMPONENT_WAS_UNMOUNTED) {return; }
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
            style={{width: this.timelineWidth() + "%"}}
          />
        </div>
        <div className="message-audio__duration">
          {this.formatTime(this.state.current) + "/" + this.formatTime(this.state.duration)}
        </div>
      </div>
    );
  }

  private timelineWidth(): number {
    const width =  (this.state.current / this.state.duration * 100);
    if (width > 100) {
      return 100;
    }
    return width;
  }

  private loaded(link: string, timeoff: Date) {
    const audiEL = new Audio(link + this.props.doc.Name);
    audiEL.preload = "none";
    this.audio = audiEL;
    this.props.audioBuffers.set(this.props.doc.Path, {el: audiEL, timeoff});
    this.load();
  }

  private formatTime(duration: number): string {
    const minutes = Math.floor(duration / 60);
    const seconds = Math.round(duration % 60);
    return minutes + ":" + (seconds > 9 ? seconds : "0" + seconds);
  }

  private timer() {
    if (this.state.play) {
      const data: {play: boolean, current: number} = {
        current: this.audio.currentTime,
        play: this.state.play,
      };
      // console.log((data.current + 0.1).toFixed(1), this.state.duration.toFixed(1));
      if (
        data.current + 0.1 >= this.state.duration ||
        // data.current > this.state.duration
        LAST_CURRENT_PLAY_POSITION  === this.state.duration.toFixed(1)
      ) {
        data.play = false;
        data.current = 0;
        this.audio.currentTime = 0;
        this.audio.pause();
        LAST_CURRENT_PLAY_POSITION = "-1";
        this.setState(data);
        return;
      }
      LAST_CURRENT_PLAY_POSITION = data.current.toFixed(1);
      this.setState(data);
    }
  }
}
