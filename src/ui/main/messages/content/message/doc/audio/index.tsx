import * as React from "react";
import { IMessageContentDoc } from "src/models/message";
require("./styles.scss");

const playIcon: string = require("assets/play.svg");
const pauseButton: string = require("assets/pause.svg");

let COMPONENT_WAS_UNMOUNTED = false;
let LAST_CURRENT_PLAY_POSITION = "-1";

interface IAudioMessageProps {
  doc: IMessageContentDoc;
  audioBuffers: Map<string, {el: HTMLAudioElement, d: number}>;
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

  public componentWillUnmount() {
    COMPONENT_WAS_UNMOUNTED = true;
    clearInterval(this.intervals);
  }

  public async load() {
    // Check buffers to loaded audio elements
    if (this.state.loaded) {return; }
    const audioElement: {el: HTMLAudioElement, d: number} = this.props.audioBuffers.get(this.props.doc.Path);
    if (audioElement && !COMPONENT_WAS_UNMOUNTED) {
      this.audio = audioElement.el;
      this.setState({
        duration: audioElement.d,
        loaded: true,
        current: 0,
      });
      this.intervals = setInterval(this.timer, 200);
      return;
    }

    const {ID} = this.props.doc;
    new Promise(async (res, rej) => {
      const data: {duration: number, blob: Blob} | {result: string} = await this.props.getAudio(ID);
      if ((data as {result: string}).result !== "Error") {
        res(data);
      } else {
        rej(data);
      }
    }).then((data: {duration: number, blob: Blob}) => {
      this.loaded(data.blob, data.duration);
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
    const audioEl = new Audio(audioUrl);
    // console.log("audio.tsx - ", duration);
    this.audio = audioEl;
    this.props.audioBuffers.set(this.props.doc.Path, {el: audioEl, d: duration});
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
      if (
        data.current.toFixed(1) === this.state.duration.toFixed(1) ||
        LAST_CURRENT_PLAY_POSITION  === data.current.toFixed(1)
      ) {
        data.play = false;
        data.current = this.state.duration;
        this.audio.pause();
        LAST_CURRENT_PLAY_POSITION = "-1";
      }
      LAST_CURRENT_PLAY_POSITION = data.current.toFixed(1);
      this.setState(data);
    }
  }
}
